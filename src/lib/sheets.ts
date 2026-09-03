/**
 * Resolves a configured Google Sheets value into a usable CSV export URL.
 *
 * Vercel's bulk ".env paste" box parses a pasted line like a query string: it splits on
 * "&" and keeps the text after the last "=". A published-sheet URL
 * (".../pub?gid=123&single=true&output=csv") therefore collapses to just "123", and the
 * route then fetches a bare number and dies with ERR_INVALID_URL. That has now cost two
 * production outages, so the value is normalised here rather than trusted verbatim.
 *
 * Accepted forms:
 *   full CSV export URL       — used as-is
 *   published URL missing the CSV params — params appended
 *   bare gid ("2073944891")   — rebuilt against PUBLISHED_DOC
 * Anything else resolves to null, which the routes treat as "not configured".
 */

/** Published-to-web id of the club sheet. Public by definition — it is served to browsers. */
const PUBLISHED_DOC =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vS3jcF-XG3QqRFtJpi0Xe0l8TYjt6Lr6Mbyr6kY302-w0cJe5J37eSX3DMKr9L_bz677zDsKro3I_DO'

const CSV_PARAMS = 'single=true&output=csv'

export function resolveSheetUrl(raw: string | undefined): string | null {
  // Quotes survive a copy-paste into the Vercel value box and make the URL unfetchable.
  const value = (raw || '').trim().replace(/^['"]|['"]$/g, '')

  if (!value) return null

  if (/^\d+$/.test(value)) {
    return `${PUBLISHED_DOC}/pub?gid=${value}&${CSV_PARAMS}`
  }

  if (!/^https?:\/\//.test(value)) return null

  // A published URL truncated before its params returns HTML, not CSV — csvToObjects would
  // parse that into nonsense rows rather than fail, so complete it here.
  if (value.includes('/pub') && !value.includes('output=csv')) {
    return `${value}${value.includes('?') ? '&' : '?'}${CSV_PARAMS}`
  }

  return value
}
