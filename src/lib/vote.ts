'use client'

/**
 * Client-side vote casting.
 *
 * Posts straight to PostgREST rather than importing supabase-js into the browser: the client
 * needs exactly one INSERT, and the library is far larger than the request it would build.
 *
 * The anon key is safe here — it is already in the bundle, and RLS is what actually guards
 * the table. The insert policy accepts a row only for a poll whose status is 'open', a
 * unique index on (poll_id, voter_key) rejects a second vote, and no policy grants update or
 * delete, so a cast vote cannot be changed or withdrawn from the client.
 */

const VOTER_KEY_STORAGE = 'dag:voter-key'
const VOTED_PREFIX = 'dag:voted:'

export type VoteResult = 'ok' | 'already-voted' | 'closed' | 'error'

/**
 * Stored when the server rejects a duplicate: this browser has voted, but which option it
 * chose cannot be recovered — voter_key is readable by no role, which is the point of it.
 * Marking the option they just clicked would be a lie, since the counted vote is a different
 * one, so the card shows results with no "your vote" marker at all.
 */
export const VOTED_CHOICE_UNKNOWN = '__voted__'

/**
 * localStorage throws outright in some privacy modes rather than returning null, so every
 * access is guarded. A viewer who blocks storage can still vote; the page just cannot
 * remember it afterwards.
 */
function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    /* storage unavailable — the vote still counts, it just is not remembered */
  }
}

/**
 * A per-browser identifier, not an identity. It deters casual double-voting and nothing
 * more: clearing storage or opening a private window earns another vote. Ballot-grade
 * integrity would need accounts, which the club does not have and does not want.
 */
export function getVoterKey(): string {
  const existing = readStorage(VOTER_KEY_STORAGE)
  if (existing) return existing

  const key =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `v-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

  writeStorage(VOTER_KEY_STORAGE, key)
  return key
}

/** The option this browser already chose, so the card can show it on a return visit. */
export function getStoredVote(pollId: string): string | null {
  return readStorage(VOTED_PREFIX + pollId)
}

export function storeVote(pollId: string, optionId: string): void {
  writeStorage(VOTED_PREFIX + pollId, optionId)
}

export async function castVote(pollId: string, optionId: string): Promise<VoteResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Voting is unavailable rather than broken when the site runs without Supabase, which is
  // still a supported configuration.
  if (!url || !key) return 'error'

  try {
    const res = await fetch(`${url}/rest/v1/poll_votes`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        poll_id: pollId,
        option_id: optionId,
        voter_key: getVoterKey(),
      }),
    })

    if (res.ok) {
      storeVote(pollId, optionId)
      return 'ok'
    }

    const body = await res.json().catch(() => null)
    const code = body?.code

    // 23505 is the unique index: this browser's key already voted on this poll. The vote it
    // refers to is real, so the ballot must close — but it is not necessarily the option just
    // clicked, and claiming otherwise would misreport the voter's own choice back to them.
    if (code === '23505') {
      storeVote(pollId, VOTED_CHOICE_UNKNOWN)
      return 'already-voted'
    }

    // 42501 is the RLS policy refusing the row, which for this table means the poll is not
    // open. A poll can close between page load and click.
    if (code === '42501') return 'closed'

    return 'error'
  } catch {
    return 'error'
  }
}
