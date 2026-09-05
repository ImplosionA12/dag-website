import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * Supabase client and the per-feed source switch.
 *
 * The migration off Google Sheets runs one feed at a time, and the sheet stays authoritative
 * until a feed has been verified against it. NEXT_PUBLIC_SUPABASE_FEEDS names the feeds that
 * have made the jump — anything not listed keeps reading the sheet, and removing a name is a
 * full rollback for that feed with no deploy.
 *
 * There is deliberately no fallback from Supabase to Sheets. A feed reads exactly one source
 * and fails loudly if that source is broken: silently serving sheet data while the Supabase
 * path is failing would hide a broken migration behind output that looks correct.
 */

export type FeedName = 'events' | 'leaderboards' | 'hall_of_fame' | 'polls'

/** Shared freshness window. The sheet path uses the same value in fetchRows. */
export const REVALIDATE_SECONDS = 60

let client: SupabaseClient | null | undefined

/** Null when unconfigured — callers treat that as "not available", never as an error. */
export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  client =
    url && key
      ? createClient(url, key, {
          auth: { persistSession: false },
          global: {
            /**
             * Without this the feeds freeze at build time.
             *
             * The API routes render statically. On the sheet path they still refreshed,
             * because fetchRows passes `next: { revalidate: 60 }` and that is what gives a
             * static route its ISR. supabase-js calls fetch with no such hint, so Next
             * treats the response as permanently cacheable: production served build-time
             * rows for as long as the deployment lived, and an edit in Studio would never
             * have appeared. Measured before the fix — the Supabase route's Age climbed
             * past 490s and never reset, while a sheet-backed route reset every ~60s.
             *
             * Matching REVALIDATE_SECONDS keeps both sources on the same freshness
             * contract, so moving a feed changes where data comes from and nothing else.
             */
            fetch: (input, init) =>
              fetch(input, { ...init, next: { revalidate: REVALIDATE_SECONDS } }),
          },
        })
      : null
  return client
}

/**
 * True when this feed should read from Supabase.
 *
 * Defaults to false: an unset or empty NEXT_PUBLIC_SUPABASE_FEEDS means every feed still
 * reads the sheet, which is the safe state to deploy in.
 */
export function usesSupabase(feed: FeedName): boolean {
  const configured = (process.env.NEXT_PUBLIC_SUPABASE_FEEDS || '')
    .split(',')
    .map(f => f.trim().toLowerCase())
    .filter(Boolean)

  if (!configured.includes(feed)) return false

  if (!getSupabase()) {
    // Naming a feed without credentials is a misconfiguration, not a fallback condition.
    throw new Error(
      `[supabase] Feed "${feed}" is set to Supabase in NEXT_PUBLIC_SUPABASE_FEEDS, but ` +
        'NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set.'
    )
  }

  return true
}
