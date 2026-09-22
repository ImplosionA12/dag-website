-- DAG undo history
-- Run after schema.sql. Re-runnable.
--
-- Juniors edit the live database directly in Supabase Studio, and those edits go live within
-- a minute. This file is what makes that safe: every insert, update and delete on club data
-- is recorded in audit.changes with the full row before and after, and one function call
-- puts things back.
--
-- In the Studio SQL editor:
--
--   select * from audit.recent;                          -- what changed lately, newest first
--   select audit.undo_last(3);                           -- undo the 3 most recent changes
--   select audit.undo_since('2026-09-22 18:00+05:30');   -- undo everything since a moment
--
-- Undo replays history backwards, so undoing a deleted poll brings back its options and its
-- votes too. The undo itself is not recorded as new changes; the undone rows are stamped
-- with undone_at instead, so running the same undo twice does nothing the second time.
--
-- Limits worth knowing:
--   * Studio edits all run as the same database role, so `actor` says "postgres" for every
--     maintainer. The history says what and when, not who.
--   * Vote inserts are not recorded (they are public and constant); vote deletes are, so a
--     cascade from a deleted poll can be undone.
--   * Schema changes (ALTER/DROP TABLE) are not covered. For those, restore from
--     schema.sql + seed.sql, which the nightly backup keeps current.
--   * audit is not an exposed API schema and grants nothing to anon/authenticated: the site
--     can neither read the history nor call undo.

create schema if not exists audit;
revoke all on schema audit from public, anon, authenticated;

create table if not exists audit.changes (
  id         bigint generated always as identity primary key,
  at         timestamptz not null default now(),
  actor      text        not null,
  table_name text        not null,
  op         text        not null check (op in ('INSERT', 'UPDATE', 'DELETE')),
  old_row    jsonb,
  new_row    jsonb,
  undone_at  timestamptz
);

create index if not exists changes_at_idx on audit.changes (at desc);

-- ─── Recording ───────────────────────────────────────────────────────────────

create or replace function audit.record() returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Set by the undo functions so putting a row back is not itself logged as a new change.
  if current_setting('audit.undoing', true) = 'on' then
    return null;
  end if;

  insert into audit.changes (actor, table_name, op, old_row, new_row)
  values (
    coalesce(
      nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email',
      session_user
    ),
    tg_table_name,
    tg_op,
    case when tg_op <> 'INSERT' then to_jsonb(old) end,
    case when tg_op <> 'DELETE' then to_jsonb(new) end
  );
  return null;
end $$;

do $$
declare
  t text;
begin
  foreach t in array array['events', 'leaderboards', 'hall_of_fame', 'members',
                           'polls', 'poll_options', 'contributors']
  loop
    execute format('drop trigger if exists audit_changes on public.%I', t);
    execute format(
      'create trigger audit_changes after insert or update or delete on public.%I
         for each row execute function audit.record()', t);
  end loop;

  drop trigger if exists audit_changes on public.poll_votes;
  create trigger audit_changes after delete on public.poll_votes
    for each row execute function audit.record();
end $$;

-- Undo re-inserts children before their parent (it walks history backwards), so the
-- foreign keys must be checkable at commit rather than per row.
do $$
declare
  fk record;
begin
  for fk in
    select conrelid::regclass as rel, conname
    from pg_constraint
    where contype = 'f'
      and connamespace = 'public'::regnamespace
      and not condeferrable
  loop
    execute format('alter table %s alter constraint %I deferrable initially immediate',
                   fk.rel, fk.conname);
  end loop;
end $$;

-- ─── Reading ─────────────────────────────────────────────────────────────────

create or replace view audit.recent as
  select
    id,
    at,
    table_name,
    op,
    coalesce(new_row, old_row) ->> coalesce(
      case table_name
        when 'events'       then 'event_name'
        when 'leaderboards' then 'player_name'
        when 'hall_of_fame' then 'player_name'
        when 'polls'        then 'title'
        when 'poll_options' then 'label'
        else 'name'
      end, 'id')                    as label,
    old_row,
    new_row,
    undone_at
  from audit.changes
  order by id desc;

-- ─── Undo ────────────────────────────────────────────────────────────────────

create or replace function audit.pk_cols(t text) returns text
language sql
stable
set search_path = ''
as $$
  select string_agg(quote_ident(a.attname), ', ' order by k.ord)
  from pg_index i
  cross join unnest(i.indkey) with ordinality as k(attnum, ord)
  join pg_attribute a on a.attrelid = i.indrelid and a.attnum = k.attnum
  where i.indrelid = format('public.%I', t)::regclass
    and i.indisprimary
$$;

create or replace function audit.undo(first_id bigint) returns integer
language plpgsql
set search_path = ''
as $$
declare
  c    record;
  rel  text;
  pk   text;
  cols text;
  n    integer := 0;
begin
  perform set_config('audit.undoing', 'on', true);
  set constraints all deferred;

  for c in
    select * from audit.changes
    where id >= first_id and undone_at is null
    order by id desc
  loop
    rel := format('public.%I', c.table_name);
    pk  := audit.pk_cols(c.table_name);

    if c.op = 'INSERT' then
      execute format(
        'delete from %1$s where (%2$s) = (select %2$s from jsonb_populate_record(null::%1$s, $1))',
        rel, pk) using c.new_row;

    elsif c.op = 'DELETE' then
      execute format(
        'insert into %1$s overriding system value
           select * from jsonb_populate_record(null::%1$s, $1)',
        rel) using c.old_row;

    else
      -- Every column except identity ids, which Postgres refuses to update and which an
      -- update never changes anyway.
      select string_agg(quote_ident(attname), ', ' order by attnum) into cols
      from pg_attribute
      where attrelid = rel::regclass and attnum > 0 and not attisdropped and attidentity = '';

      execute format(
        'update %1$s set (%2$s) = (select %2$s from jsonb_populate_record(null::%1$s, $1))
          where (%3$s) = (select %3$s from jsonb_populate_record(null::%1$s, $2))',
        rel, cols, pk) using c.old_row, c.new_row;
    end if;

    update audit.changes set undone_at = now() where id = c.id;
    n := n + 1;
  end loop;

  perform set_config('audit.undoing', 'off', true);
  return n;
end $$;

create or replace function audit.undo_since(since timestamptz) returns integer
language sql
set search_path = ''
as $$
  select audit.undo(coalesce(
    (select min(id) from audit.changes where at >= since and undone_at is null),
    9223372036854775807))
$$;

create or replace function audit.undo_last(how_many integer default 1) returns integer
language sql
set search_path = ''
as $$
  select audit.undo(coalesce(
    (select min(id) from (
       select id from audit.changes where undone_at is null order by id desc limit how_many
     ) latest),
    9223372036854775807))
$$;

revoke all on all tables    in schema audit from public, anon, authenticated;
revoke all on all functions in schema audit from public, anon, authenticated;
