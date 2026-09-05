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

let client: SupabaseClient | null | undefined

/** Null when unconfigured — callers treat that as "not available", never as an error. */
export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  client = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null
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
