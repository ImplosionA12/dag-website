/**
 * Environment variable validation.
 * Import this in layout.tsx to validate at build time.
 * Missing optional vars log warnings; missing required vars throw.
 */

const optional = [
  'NEXT_PUBLIC_SHEETS_EVENTS_URL',
  'NEXT_PUBLIC_SHEETS_LEADERBOARDS_URL',
  'NEXT_PUBLIC_SHEETS_HOF_URL',
  'NEXT_PUBLIC_SHEETS_POLLS_URL',
  'NEXT_PUBLIC_JOIN_FORM_URL',
] as const

const recommended = [
  'NEXT_PUBLIC_SITE_URL',
] as const

export function validateEnv() {
  const missing: string[] = []

  for (const key of optional) {
    if (!process.env[key]) {
      missing.push(key)
    }
  }

  if (missing.length > 0) {
    console.warn(
      `⚠ DAG: Optional env vars not set (mock data will be used): ${missing.join(', ')}`
    )
  }

  for (const key of recommended) {
    if (!process.env[key] || process.env[key] === 'https://yourdomain.com') {
      console.warn(
        `⚠ DAG: ${key} is not configured — SEO metadata will use placeholder URL`
      )
    }
  }
}
