import { MEMBERS } from '../members'

describe('MEMBERS data', () => {
  it('has at least one member', () => {
    expect(MEMBERS.length).toBeGreaterThan(0)
  })

  it('has exactly one president', () => {
    const presidents = MEMBERS.filter(m => m.isPresident)
    expect(presidents).toHaveLength(1)
  })

  it('president has required fields', () => {
    const president = MEMBERS.find(m => m.isPresident)!
    expect(president.name).toBeTruthy()
    expect(president.role).toBe('President')
  })

  it('all members have name and role', () => {
    for (const member of MEMBERS) {
      expect(member.name).toBeTruthy()
      expect(member.role).toBeTruthy()
      expect(Array.isArray(member.games)).toBe(true)
      expect(typeof member.isFounder).toBe('boolean')
    }
  })

  it('games array contains valid GameType values', () => {
    const validTypes = ['FF', 'BGMI', 'Valorant', 'Anime', 'Other']
    for (const member of MEMBERS) {
      for (const game of member.games) {
        expect(validTypes).toContain(game)
      }
    }
  })
})
