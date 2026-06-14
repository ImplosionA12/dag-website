import { DATA_CONFIG } from '../data'

describe('DATA_CONFIG', () => {
  it('has club metadata', () => {
    expect(DATA_CONFIG.club.name).toBe('DAG')
    expect(DATA_CONFIG.club.fullName).toBe('Drushya Animations & Gaming')
    expect(DATA_CONFIG.club.tagline).toBeTruthy()
  })

  it('has current season set', () => {
    expect(DATA_CONFIG.club.currentSeason).toBeTruthy()
    expect(DATA_CONFIG.club.seasons).toContain(DATA_CONFIG.club.currentSeason)
  })

  it('has at least one season', () => {
    expect(DATA_CONFIG.club.seasons.length).toBeGreaterThan(0)
  })

  it('has sheets config', () => {
    expect(DATA_CONFIG.sheets).toBeDefined()
    expect(typeof DATA_CONFIG.sheets.eventsUrl).toBe('string')
    expect(typeof DATA_CONFIG.sheets.leaderboardsUrl).toBe('string')
    expect(typeof DATA_CONFIG.sheets.hofUrl).toBe('string')
  })

  it('has forms config', () => {
    expect(DATA_CONFIG.forms).toBeDefined()
    expect(typeof DATA_CONFIG.forms.joinUs).toBe('string')
  })
})
