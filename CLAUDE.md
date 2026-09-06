# DAG Website — Project Guide for Claude

DAG (Drushya Animations & Gaming) — a cinematic gaming-club website built around an
"Enter the Arena" concept. Each page is a different zone with its own atmosphere; scrolling
is meant to feel like a journey, not a feed. Aim for Rockstar/Riot-tier polish in every change.

## Tech stack
- Next.js 14 (App Router) · TypeScript · Tailwind CSS · npm
- Motion: GSAP + @gsap/react (dynamic import only), Framer Motion, Three.js, lenis (smooth scroll)
- No backend. Data comes from Google Sheets (CSV export) → Next.js API routes (ISR 60s) → client hooks.

## Commands
- `npm run dev` — local dev server
- `npm run build` — production build (must pass before any push)
- `npm run lint` — ESLint (must be clean)
- `npm test` — Jest test suite (must stay green)
- `npm run test:coverage` — tests with coverage

Before pushing any change, run `npm run lint`, `npm test`, and `npm run build`. Do not push if any fail.

## Design system — "AAA Title Screen × Tournament Broadcast"
Authoritative tokens live in `src/app/globals.css`. Use them; never hardcode hex/px that a token covers.

- **Colors:** `--void #050408`, `--surface-1..3`, violet ambient (`--violet-700/500/300`, primary `#9D4EDD`),
  gold (`--gold-600/400/200`, `#FFB703`), `--line-1/2`, `--bracket`, `--text-hi/mid/lo`, `--zone-accent`.
- **Gold discipline (important):** gold = victory only. It may be used ONLY by `CTAButton`, `RankTag(#1)`/Podium #1,
  and the Hall of Fame zone (`[data-zone='hof']` flips `--zone-accent` to gold). Do not use gold anywhere else.
- **Fonts:** Big Shoulders Display (`--font-display`, 700–900), Chakra Petch (`--font-hud`, tabular-nums for ALL
  numbers), Archivo (`--font-body`). Do not reintroduce Rajdhani/DM Sans/Orbitron.
- **Type classes:** `.type-display-xl/.type-display/.type-h2/.type-h3/.type-hud/.type-hud-lg/.type-label/.type-body`.
  Use these, not raw font-size utilities.
- **Zone theming:** each page sets `data-zone` (home, events, leaderboards, hof, members, about, polls);
  components read `var(--zone-accent)`.
- **Signature elements:** `HudFrame` corner brackets, "SZN 01 // LIVE"-style telemetry labels (`HudLabel`),
  `.diag` slash clip.

## Motion rules
- GSAP only via `src/lib/motion/gsap.ts` `loadGsap()` singleton — never static-import gsap.
- Framer easings/durations from `src/lib/motion/easing.ts` (`EASE_OUT`, `EASE_EXPO`, `DUR`, `STAGGER`).
  Framer ease tuples need `as const` — use the easing.ts constants.
- Lenis singleton in `src/lib/motion/lenis.ts`, wired via `LenisProvider`. Lenis owns scroll, so there is no
  `scroll-behavior: smooth` in CSS.
- Gate all heavy motion (Three.js, GSAP, Lenis) behind `useReducedMotion()`, which is true for
  `prefers-reduced-motion` OR viewport `<768px`.

## Project structure
```
src/
  app/                 layout.tsx (fonts, chrome, JSON-LD, skip-link) + 7 pages, each with data-zone
  components/
    layout/            SeasonTicker, Navbar (pause-menu mobile), Footer, PageTransition (enter-only)
    ui/                HudFrame, HudLabel, Surface, CTAButton, GhostButton, DisplayHeading, ZoneHero,
                       GameBadge, SeasonBadge, RankTag, StatCounter, SectionReveal, AnimatedBar,
                       EmptyState, ErrorState, SkeletonBlock — MUST stay jsdom-safe (no GSAP/Three/Lenis imports)
    cinematic/         ScrambleText, PinnedScene, CustomCursor, FilmGrain, BootSequence, AmbientGlow,
                       ProgressRail, MarqueeStrip
    three/             TitleField.tsx — GPU shader particle ring (~12k pts), dynamic import + gradient fallback
    providers/         LenisProvider.tsx
    sections/          home/ events/ leaderboards/ hall-of-fame/ members/ about/ polls/
  lib/motion/          gsap.ts, lenis.ts, easing.ts
  lib/csv.ts           CSV parsing
  lib/feeds.ts         server-side feeds (events, leaderboards, hof, polls, members)
  lib/supabase.ts      client + per-feed source switch · lib/vote.ts client vote casting
  config/data.ts       DATA_CONFIG · types/index.ts (HOF_CATEGORIES)
```

## Data architecture
- **Supabase is the source of truth** (project `dag-website`, ref `shuorrkfajxivdhgaylt`).
  All feeds — events, leaderboards, hall of fame, polls, members — read Postgres.
  Schema and a regenerable seed live in `supabase/`.
- `NEXT_PUBLIC_SUPABASE_FEEDS` is a comma list of feeds on Supabase. Removing a name rolls
  that feed back to its Google Sheet; the sheets are kept as the rollback path. These are
  `NEXT_PUBLIC_` vars, so any change needs a **rebuild**, not just an env edit.
- No source falls back to another. A feed reads one source and fails loudly, so a broken
  migration cannot hide behind correct-looking data.
- Anything reading Supabase **must** declare `revalidate` — supabase-js sends no Next cache
  hint, so a static route would otherwise freeze at build time and never show an edit.
- **Never hardcode club data.** Members used to live in `src/data/members.ts`; it is now a
  table, because committee turnover should not need a deploy.
- `npm run backup` rewrites `supabase/seed.sql` from the live database. The free tier takes
  no backups, so the repo is the backup.
- Legacy path (still supported per feed): Google Sheet → CSV export URL → API route
  (parses via `lib/csv.ts`) → hook → page.
- Hooks: `useEvents` / `useLeaderboards` / `useHallOfFame` (FetchState + refetch), `usePolls` (30s auto-poll).
- When env vars are empty, the site falls back to mock/empty data and renders `EmptyState`
  ("NO DATA // STANDBY") / `ErrorState` ("SIGNAL LOST"). This is intentional — builds must still succeed
  with no env vars set.
- Season 1 is the current season. To add S2: update `DATA_CONFIG.seasons` + `currentSeason`.

## Environment variables (all `NEXT_PUBLIC_*`, set in Vercel)
- `NEXT_PUBLIC_SITE_URL` — canonical site URL, no trailing slash (used for SEO/OG/JSON-LD)
- `NEXT_PUBLIC_SHEETS_EVENTS_URL`
- `NEXT_PUBLIC_SHEETS_LEADERBOARDS_URL`
- `NEXT_PUBLIC_SHEETS_HOF_URL`
- `NEXT_PUBLIC_SHEETS_POLLS_URL`
- `NEXT_PUBLIC_JOIN_FORM_URL`

Because they are `NEXT_PUBLIC_*`, they are baked in at build time — changing them requires a redeploy,
and no secret should ever go in a `NEXT_PUBLIC_` var.

## Testing conventions
- Keep the suite green (currently ~107 tests / 19 suites). `components/ui/*` must remain jsdom-safe
  (no GSAP/Three/Lenis imports) so they can be unit-tested.
- `jest.setup.ts` has no global mocks — mock `matchMedia` / `IntersectionObserver` per test file.

## Gotchas
- Every page needs `pt-page-top` except self-padding heroes (fixed ticker 36px + nav 64px).
- `AnimatePresence` exit is unreliable in App Router — `PageTransition` is enter-only + shutter wipe.
- `ScrambleText` / countdowns must compute post-mount only (hydration safety).

## Git / commit conventions
- Commit messages: plain and descriptive. Do NOT add a `Co-Authored-By: Claude` trailer.
- Never commit `.claude/` (it is gitignored).
- Default branch is `master`; it tracks `origin/master`. Merging to `master` triggers a Vercel auto-deploy.
