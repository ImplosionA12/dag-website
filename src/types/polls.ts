// ─── Poll Types ─────────────────────────────────────────────────────────────

export type PollType = 'event' | 'general' | 'animation'

export type PollStatus = 'open' | 'closed'

export interface PollOption {
  id: string
  label: string
  votes: number
  percentage: number
}

export interface Poll {
  id: string
  type: PollType
  title: string
  description?: string
  season: string
  status: PollStatus
  options: PollOption[]
  total_voters: number
  ends_at?: string
  form_url?: string
}

export interface PollsResponse {
  polls: Poll[]
}
