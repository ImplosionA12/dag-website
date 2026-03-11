export const DATA_CONFIG = {
  sheets: {
    eventsUrl:       process.env.NEXT_PUBLIC_SHEETS_EVENTS_URL       || '',
    leaderboardsUrl: process.env.NEXT_PUBLIC_SHEETS_LEADERBOARDS_URL || '',
    hofUrl:          process.env.NEXT_PUBLIC_SHEETS_HOF_URL          || '',
  },
  forms: {
    joinUs: process.env.NEXT_PUBLIC_JOIN_FORM_URL || '',
  },
  club: {
    name: 'DAG',
    fullName: 'Drushya Animations & Gaming',
    tagline: 'Where Gaming Meets Animation',
    currentSeason: 'S1',
    seasons: ['S1'],
    // To add Season 2: seasons: ['S1', 'S2'], currentSeason: 'S2'
  },
}
