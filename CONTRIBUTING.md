# Working on the DAG website

Welcome to the web crew. This is the real site, not a practice copy. What you change goes
live, and the club sees it. That's the point: by the end you'll have shipped real work to a
real production site, with your name on it.

It's also safe. Every data edit can be undone and every deploy can be rolled back, so a
mistake is a five-minute fix, not a disaster. Don't be scared of breaking things. Do tell
someone when you do.

---

## What you'll touch

| Part | Where | What it does |
|---|---|---|
| **Data** | Supabase Studio, project `dag-website` | Events, results, hall of fame, polls, members, crew credits. Edits show on the site within about a minute. |
| **Code** | This repo, branch `master` | Next.js 14 + TypeScript + Tailwind. Every push to `master` deploys to Vercel. |
| **Checks** | GitHub → Actions → *checks* | Lint, tests and a build run on every push. Green tick = fine. Red X = go fix it. |

---

## 1. Editing data (no code needed)

1. Open Supabase Studio → project **dag-website** → **Table Editor**.
2. Pick a table and edit the row like a spreadsheet.
3. Wait a minute, then refresh the site to see it.

The tables:

- `events`: `status` is `open`, `closed` or `completed`. `game_type` is `FF`, `BGMI`,
  `Valorant`, `Anime` or `Other`.
- `leaderboards`: one row per player per event. `event_name` must match the event's name
  **exactly**, or the standings won't attach to the event.
- `hall_of_fame`: one winner per category per season.
- `polls` + `poll_options`: to close a poll, set its `status` to `closed`. Don't delete a
  poll that has votes.
- `members`: the roster. `position` sets the display order.
- `contributors`: the "Built by the club" credits on the About page. **Add yourself here
  once your first change is live.**

The database refuses values it doesn't allow (say, a `game_type` of `valorant` in lowercase).
If a save fails, read the error. It'll name the column that's wrong.

---

## 2. Changing code

### One-time setup

```bash
git clone https://github.com/ImplosionA12/dag-website.git
cd dag-website
npm install
```

Ask a maintainer for the `.env.local` file. It holds the public Supabase URL and key. Never
commit it. It's already in `.gitignore`.

```bash
npm run dev
```

Then open http://localhost:3000.

### Every change

```bash
git pull                 # start from the latest
# ...make your change...
npm run lint             # must be clean
npm test                 # must stay green
npm run build            # must succeed
git add <files>
git commit -m "Say what changed and why, in plain words"
git push
```

Then open the repo's **Actions** tab and wait for the green tick. Vercel deploys the same
commit, and it's live in 1–2 minutes.

For something big or risky, push to a branch and open a pull request instead. Vercel gives
every PR its own preview link, so you can show people before it goes live.

### House rules

Read `CLAUDE.md` before your first code change. The rules people break most often:

- **Gold (`#FFB703`) means victory only.** Only CTA buttons, rank #1 and the Hall of Fame
  get gold. Nothing else, however good it looks.
- **Use the design tokens** in `src/app/globals.css` and the type classes (`.type-h2`,
  `.type-body`…). Don't hardcode colours or font sizes.
- **Never hardcode club data** in the code. If it changes when the committee changes, it
  belongs in a Supabase table.
- Components in `src/components/ui/` must not import GSAP, Three.js or Lenis. The tests run
  them without a browser.

---

## 3. When something goes wrong

Tell a maintainer first, then do whichever of these fits.

### Undo a data mistake

In Supabase Studio → **SQL Editor**:

```sql
-- What changed recently, newest first
select id, at, table_name, op, label from audit.recent limit 20;

-- Undo the last change (or the last 3)
select audit.undo_last(1);
select audit.undo_last(3);

-- Undo everything since a point in time (IST shown here)
select audit.undo_since('2026-09-22 18:00+05:30');
```

Undo understands cascades, so undoing a deleted poll brings back its options and votes.
It covers row edits, not table or column changes.

### Roll back a bad deploy

- **Fastest:** Vercel → project → **Deployments** → the last good one → **⋯ → Instant
  Rollback**. The site is back in seconds. Then fix the code at your own pace.
- **In git:** `git revert <commit>` then `git push`. That adds a new commit that undoes the bad
  one without rewriting history.

Never force-push to `master`. It's blocked anyway, because history is what makes rollback
possible.

### Restore a whole day

Every night the live data is saved into `supabase/seed.sql` and committed. To go back to
any day, take that day's version of the file from git history and run it in the SQL editor.
