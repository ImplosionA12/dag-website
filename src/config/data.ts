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
    // S1 = academic year 2025-26 (Cyber Tournament through Blender Bootcamp).
    // S2 = 2026-27, opened by IGNIS S1 in July 2026.
    currentSeason: 'S2',
    seasons: ['S1', 'S2'],
    // To add Season 3: seasons: ['S1', 'S2', 'S3'], currentSeason: 'S3'
  },
}
