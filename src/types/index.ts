// ─── Game & Status Enums ────────────────────────────────────────────────────

export type GameType = 'FF' | 'BGMI' | 'Valorant' | 'Anime' | 'Other'

export type EventStatus = 'open' | 'closed' | 'completed'

export type EventType = 'tournament' | 'workshop' | 'screening'

export type HoFCategory =
  | 'Highest Scorer'
  | 'Iron Player'
  | 'Speed Demon'
  | 'Team of the Year'
  | 'Rookie of the Year'
  | 'Clip God'

// ─── Core Data Models ────────────────────────────────────────────────────────

export interface Event {
  id: string
  event_name: string
  date: string            // ISO date string YYYY-MM-DD
  description: string
  season: string
  status: EventStatus
  event_type: EventType   // 'tournament' | 'workshop' | 'screening'
  register_url: string
  game_type: GameType
  recording_url?: string  // YouTube or Drive link — present for workshops/screenings
}

export interface LeaderboardEntry {
  id: string
  event_name: string
  season: string
  rank: number
  player_name: string
  points: number
  game_type: GameType
  team_name?: string
}

export interface HallOfFameEntry {
  category: HoFCategory
  player_name: string
  season: string
  description: string
  game_type: GameType
}

export interface Member {
  name: string
  role: string
  games: GameType[]
  isFounder: boolean
  isPresident?: boolean
  note?: string
  socials?: {
    instagram?: string
    discord?: string
  }
}

// ─── API Response Types ──────────────────────────────────────────────────────

export interface EventsResponse {
  events: Event[]
}

export interface LeaderboardsResponse {
  leaderboards: LeaderboardEntry[]
}

export interface HallOfFameResponse {
  hall_of_fame: HallOfFameEntry[]
}

// ─── UI State Types ──────────────────────────────────────────────────────────

export interface FetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

// ─── HoF Display Config ──────────────────────────────────────────────────────

export const HOF_CATEGORIES: { category: HoFCategory; icon: string; description: string }[] = [
  {
    category: 'Highest Scorer',
    icon: '👑',
    description: 'Most points accumulated across all season events.',
  },
  {
    category: 'Iron Player',
    icon: '🔥',
    description: 'Participated in every single event this season. Never missed a battle.',
  },
  {
    category: 'Speed Demon',
    icon: '⚡',
    description: 'Fastest performance times recorded in competitive play.',
  },
  {
    category: 'Team of the Year',
    icon: '🏆',
    description: 'The squad that dominated the season with collective excellence.',
  },
  {
    category: 'Rookie of the Year',
    icon: '🌟',
    description: 'The brightest new talent to emerge from this season.',
  },
  {
    category: 'Clip God',
    icon: '🎬',
    description: 'Creator of the most legendary moments. The highlight reel that defined the season.',
  },
]
