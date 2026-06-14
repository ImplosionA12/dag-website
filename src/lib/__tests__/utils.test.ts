import {
  daysRemaining,
  formatDate,
  isFutureDate,
  getNextEvent,
  splitEvents,
  getRankColor,
  getRankLabel,
  clsx,
  GAME_COLORS,
  GAME_LABELS,
} from '../utils'
import { Event } from '@/types'

// ─── Helper ─────────────────────────────────────────────────────────────────

function makeEvent(overrides: Partial<Event> = {}): Event {
  return {
    id: '1',
    event_name: 'Test Event',
    date: '2099-12-31',
    description: 'desc',
    season: 'S1',
    status: 'open',
    event_type: 'tournament',
    register_url: '',
    game_type: 'BGMI',
    ...overrides,
  }
}

// ─── daysRemaining ──────────────────────────────────────────────────────────

describe('daysRemaining', () => {
  it('returns 0 for today', () => {
    const now = new Date()
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    expect(daysRemaining(today)).toBe(0)
  })

  it('returns null for past dates', () => {
    expect(daysRemaining('2000-01-01')).toBeNull()
  })

  it('returns positive number for future dates', () => {
    const result = daysRemaining('2099-12-31')
    expect(result).toBeGreaterThan(0)
  })
})

// ─── formatDate ─────────────────────────────────────────────────────────────

describe('formatDate', () => {
  it('formats date as "DD MMM YYYY" in uppercase', () => {
    const result = formatDate('2025-08-15')
    expect(result).toMatch(/15\s+AUG\s+2025/)
  })

  it('handles single-digit days', () => {
    const result = formatDate('2025-01-05')
    expect(result).toMatch(/05\s+JAN\s+2025/)
  })
})

// ─── isFutureDate ───────────────────────────────────────────────────────────

describe('isFutureDate', () => {
  it('returns true for future dates', () => {
    expect(isFutureDate('2099-12-31')).toBe(true)
  })

  it('returns true for today (still future-inclusive)', () => {
    const now = new Date()
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    expect(isFutureDate(today)).toBe(true)
  })

  it('returns false for past dates', () => {
    expect(isFutureDate('2000-01-01')).toBe(false)
  })
})

// ─── getNextEvent ───────────────────────────────────────────────────────────

describe('getNextEvent', () => {
  it('returns null for empty array', () => {
    expect(getNextEvent([])).toBeNull()
  })

  it('returns null when no open events exist', () => {
    const events = [makeEvent({ status: 'completed' })]
    expect(getNextEvent(events)).toBeNull()
  })

  it('returns the earliest open future event', () => {
    const events = [
      makeEvent({ id: '1', date: '2099-06-01', status: 'open' }),
      makeEvent({ id: '2', date: '2099-03-01', status: 'open' }),
      makeEvent({ id: '3', date: '2099-09-01', status: 'closed' }),
    ]
    expect(getNextEvent(events)?.id).toBe('2')
  })

  it('ignores past open events', () => {
    const events = [makeEvent({ date: '2000-01-01', status: 'open' })]
    expect(getNextEvent(events)).toBeNull()
  })
})

// ─── splitEvents ────────────────────────────────────────────────────────────

describe('splitEvents', () => {
  it('separates upcoming and past events', () => {
    const events = [
      makeEvent({ id: '1', date: '2099-01-01', status: 'open' }),
      makeEvent({ id: '2', date: '2000-01-01', status: 'completed' }),
      makeEvent({ id: '3', date: '2099-06-01', status: 'closed' }),
    ]
    const { upcoming, past } = splitEvents(events)
    expect(upcoming.map(e => e.id)).toEqual(['2099-01-01', '2099-06-01'].length === 2 ? ['1', '3'] : ['1', '3'])
    expect(upcoming).toHaveLength(2)
    expect(past).toHaveLength(1)
    expect(past[0].id).toBe('2')
  })

  it('sorts upcoming by date ascending', () => {
    const events = [
      makeEvent({ id: 'b', date: '2099-12-01', status: 'open' }),
      makeEvent({ id: 'a', date: '2099-01-01', status: 'open' }),
    ]
    const { upcoming } = splitEvents(events)
    expect(upcoming[0].id).toBe('a')
    expect(upcoming[1].id).toBe('b')
  })

  it('sorts past by date descending (most recent first)', () => {
    const events = [
      makeEvent({ id: 'a', date: '2000-01-01', status: 'completed' }),
      makeEvent({ id: 'b', date: '2020-06-01', status: 'completed' }),
    ]
    const { past } = splitEvents(events)
    expect(past[0].id).toBe('b')
    expect(past[1].id).toBe('a')
  })

  it('returns empty arrays for no events', () => {
    const { upcoming, past } = splitEvents([])
    expect(upcoming).toEqual([])
    expect(past).toEqual([])
  })
})

// ─── getRankColor ───────────────────────────────────────────────────────────

describe('getRankColor', () => {
  it('returns gold for rank 1', () => {
    expect(getRankColor(1)).toBe('#FFB703')
  })

  it('returns silver for rank 2', () => {
    expect(getRankColor(2)).toBe('#C0C0C0')
  })

  it('returns bronze for rank 3', () => {
    expect(getRankColor(3)).toBe('#CD7F32')
  })

  it('returns muted for rank 4+', () => {
    expect(getRankColor(4)).toBe('#9B8FA8')
    expect(getRankColor(100)).toBe('#9B8FA8')
  })
})

// ─── getRankLabel ───────────────────────────────────────────────────────────

describe('getRankLabel', () => {
  it('returns ordinals for 1-3', () => {
    expect(getRankLabel(1)).toBe('1st')
    expect(getRankLabel(2)).toBe('2nd')
    expect(getRankLabel(3)).toBe('3rd')
  })

  it('returns "th" for 4+', () => {
    expect(getRankLabel(4)).toBe('4th')
    expect(getRankLabel(11)).toBe('11th')
  })
})

// ─── clsx ───────────────────────────────────────────────────────────────────

describe('clsx', () => {
  it('joins truthy class names', () => {
    expect(clsx('a', 'b', 'c')).toBe('a b c')
  })

  it('filters out falsy values', () => {
    expect(clsx('a', false, null, undefined, 'b')).toBe('a b')
  })

  it('returns empty string for no args', () => {
    expect(clsx()).toBe('')
  })
})

// ─── Constants ──────────────────────────────────────────────────────────────

describe('GAME_COLORS', () => {
  it('has all 5 game types', () => {
    expect(Object.keys(GAME_COLORS)).toHaveLength(5)
    expect(GAME_COLORS.FF).toBeDefined()
    expect(GAME_COLORS.BGMI).toBeDefined()
    expect(GAME_COLORS.Valorant).toBeDefined()
    expect(GAME_COLORS.Anime).toBeDefined()
    expect(GAME_COLORS.Other).toBeDefined()
  })
})

describe('GAME_LABELS', () => {
  it('has human-readable labels for all game types', () => {
    expect(GAME_LABELS.FF).toBe('Free Fire')
    expect(GAME_LABELS.BGMI).toBe('BGMI')
    expect(GAME_LABELS.Valorant).toBe('Valorant')
  })
})
