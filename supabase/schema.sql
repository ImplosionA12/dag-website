-- DAG website schema
-- Run this in the Supabase SQL editor, then run seed.sql. Both files are re-runnable.
--
-- Design notes:
--   * Every table is world-readable. The site has no login and the data is already public
--     on the sheet; RLS exists here to stop writes, not reads.
--   * Nothing is writable by the anon key except a poll vote. Maintainers edit through
--     Supabase Studio, which uses their own authenticated session, not the anon key.
--   * Enum-ish columns use CHECK constraints rather than Postgres enums: adding a value to
--     an enum needs a migration and locks, a CHECK is a one-line ALTER. The app's union
--     types are the source of truth for what these mean.

-- ─── Events ──────────────────────────────────────────────────────────────────

create table if not exists public.events (
  id            text primary key,
  event_name    text        not null,
  date          date        not null,
  description   text        not null default '',
  season        text        not null,
  status        text        not null check (status in ('open', 'closed', 'completed')),
  -- 'hackathon' and 'experience' close the gap that forced PixelHack and VR Zone to be
  -- filed as tournaments on the sheet. The app's EventType union must be widened to match
  -- before either value is used.
  event_type    text        not null check (event_type in ('tournament', 'workshop', 'screening', 'hackathon', 'experience')),
  register_url  text        not null default '',
  game_type     text        not null check (game_type in ('FF', 'BGMI', 'Valorant', 'Anime', 'Other')),
  recording_url text,
  created_at    timestamptz not null default now()
);

create index if not exists events_date_idx on public.events (date desc);

-- ─── Leaderboards ────────────────────────────────────────────────────────────

create table if not exists public.leaderboards (
  id          text primary key,
  -- Text, not a foreign key to events: the sheet has always matched standings to events by
  -- name, and the app still does. Promote this to a real reference once every row is
  -- confirmed to match an event id exactly.
  event_name  text        not null,
  season      text        not null,
  rank        integer     not null check (rank > 0),
  player_name text        not null,
  points      integer     not null,
  game_type   text        not null check (game_type in ('FF', 'BGMI', 'Valorant', 'Anime', 'Other')),
  team_name   text,
  created_at  timestamptz not null default now()
);

create index if not exists leaderboards_event_idx on public.leaderboards (lower(event_name));
create index if not exists leaderboards_season_idx on public.leaderboards (season, points desc);

-- ─── Hall of Fame ────────────────────────────────────────────────────────────

create table if not exists public.hall_of_fame (
  id          bigint generated always as identity primary key,
  category    text        not null check (category in (
                'Highest Scorer', 'Iron Player', 'Speed Demon',
                'Team of the Year', 'Rookie of the Year', 'Clip God')),
  player_name text        not null,
  season      text        not null,
  description text        not null default '',
  game_type   text        not null check (game_type in ('FF', 'BGMI', 'Valorant', 'Anime', 'Other')),
  created_at  timestamptz not null default now(),
  unique (category, season)
);

-- ─── Members ─────────────────────────────────────────────────────────────────

-- The roster used to be a hardcoded array in the repo, so every committee change was a code
-- edit and a deploy. It is club data that turns over every year; no developer should be a
-- bottleneck for it.
create table if not exists public.members (
  id           bigint generated always as identity primary key,
  name         text        not null,
  role         text        not null,
  games        text[]      not null default '{}',
  is_founder   boolean     not null default false,
  is_president boolean     not null default false,
  note         text,
  instagram    text,
  discord      text,
  -- Explicit ordering so the roster is arranged by the club, not by insertion order.
  position     integer     not null default 0,
  created_at   timestamptz not null default now(),
  unique (name),
  constraint members_games_valid check (
    games <@ array['FF', 'BGMI', 'Valorant', 'Anime', 'Other']::text[]
  )
);

create index if not exists members_position_idx on public.members (position, name);

-- ─── Polls ───────────────────────────────────────────────────────────────────

create table if not exists public.polls (
  id          text primary key,
  type        text        not null check (type in ('event', 'general', 'animation')),
  title       text        not null,
  description text,
  season      text        not null,
  status      text        not null check (status in ('open', 'closed')),
  ends_at     date,
  form_url    text,
  created_at  timestamptz not null default now()
);

create table if not exists public.poll_options (
  id       text    not null,
  poll_id  text    not null references public.polls (id) on delete cascade,
  label    text    not null,
  position integer not null default 0,
  primary key (poll_id, id)
);

-- One row per vote rather than a counter column: a counter cannot be incremented safely
-- from the anon key without granting update on polls, and per-row votes make it possible to
-- audit or undo a brigade later.
create table if not exists public.poll_votes (
  id         bigint generated always as identity primary key,
  poll_id    text        not null references public.polls (id) on delete cascade,
  option_id  text        not null,
  -- Client-generated id kept in the browser. This deters casual double-voting; it is not
  -- an identity check, and nothing here should be treated as one.
  voter_key  text        not null,
  created_at timestamptz not null default now(),
  foreign key (poll_id, option_id) references public.poll_options (poll_id, id) on delete cascade,
  unique (poll_id, voter_key)
);

create index if not exists poll_votes_poll_idx on public.poll_votes (poll_id);

-- Tallies belong in the database, not in the app: the app would otherwise fetch every vote
-- row just to count them.
--
-- The view runs with INVOKER rights and the caller is given column-level select on
-- poll_votes. A definer view would also work, but column grants are the tighter guarantee:
-- no role can read voter_key at all, rather than relying on the view never exposing it.
-- count() is over option_id rather than id for the same reason — id is not granted.
create or replace view public.poll_results as
  select
    o.poll_id,
    o.id       as option_id,
    o.label,
    o.position,
    count(v.option_id) as votes
  from public.poll_options o
  left join public.poll_votes v
    on v.poll_id = o.poll_id and v.option_id = o.id
  group by o.poll_id, o.id, o.label, o.position;

alter view public.poll_results set (security_invoker = on);

-- ─── Row level security ──────────────────────────────────────────────────────

alter table public.events        enable row level security;
alter table public.leaderboards  enable row level security;
alter table public.hall_of_fame  enable row level security;
alter table public.polls         enable row level security;
alter table public.poll_options  enable row level security;
alter table public.poll_votes    enable row level security;
alter table public.members       enable row level security;

-- CREATE POLICY has no IF NOT EXISTS, so drop first to keep this file re-runnable.
drop policy if exists "public read events"       on public.events;
drop policy if exists "public read leaderboards" on public.leaderboards;
drop policy if exists "public read hof"          on public.hall_of_fame;
drop policy if exists "public read polls"        on public.polls;
drop policy if exists "public read poll options" on public.poll_options;
drop policy if exists "anyone may vote"          on public.poll_votes;
drop policy if exists "public read members"      on public.members;

-- Public read. Writes are absent by design: with RLS on and no write policy, the anon key
-- cannot insert, update or delete regardless of what the client asks for.
create policy "public read events"       on public.events       for select using (true);
create policy "public read leaderboards" on public.leaderboards for select using (true);
create policy "public read hof"          on public.hall_of_fame for select using (true);
create policy "public read polls"        on public.polls        for select using (true);
create policy "public read poll options" on public.poll_options for select using (true);
create policy "public read members"      on public.members      for select using (true);

-- Votes are the single exception: anyone may cast one, and no one may change or delete one.
create policy "anyone may vote" on public.poll_votes
  for insert with check (
    exists (select 1 from public.polls p where p.id = poll_id and p.status = 'open')
  );

-- Reading votes is allowed by policy but constrained by column privilege: the tally columns
-- are readable, voter_key and created_at are not granted to anyone.
create policy "public read votes" on public.poll_votes for select using (true);

revoke select on public.poll_votes from anon, authenticated;
grant  select (poll_id, option_id) on public.poll_votes to anon, authenticated;
grant  select on public.poll_results to anon, authenticated;

-- The helper installed by the project's "Enable automatic RLS" option is exposed as an RPC
-- endpoint by default; nothing outside the database should be able to call it. Guarded so
-- this file still runs on a project created without that option.
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'revoke execute on function public.rls_auto_enable() from anon, authenticated, public';
  end if;
end $$;
