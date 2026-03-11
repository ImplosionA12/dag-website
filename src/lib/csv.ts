/**
 * Minimal RFC-4180-compatible CSV parser.
 *
 * Handles:
 *  - Quoted fields (commas and newlines inside quotes)
 *  - Escaped double-quotes ("")
 *  - \r\n and \n line endings
 *  - Empty rows (skipped)
 */
function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let i = 0
  const len = text.length

  while (i < len) {
    const row: string[] = []

    while (i < len) {
      let field = ''

      if (text[i] === '"') {
        i++ // skip opening quote
        while (i < len) {
          if (text[i] === '"') {
            if (text[i + 1] === '"') {
              field += '"'
              i += 2
            } else {
              i++ // skip closing quote
              break
            }
          } else {
            field += text[i++]
          }
        }
      } else {
        while (i < len && text[i] !== ',' && text[i] !== '\n' && text[i] !== '\r') {
          field += text[i++]
        }
        field = field.trim()
      }

      row.push(field)

      if (i < len && text[i] === ',') {
        i++ // comma → next field
      } else {
        break // newline or EOF → row done
      }
    }

    // Consume line ending
    if (i < len && text[i] === '\r') i++
    if (i < len && text[i] === '\n') i++

    if (row.some(f => f.length > 0)) {
      rows.push(row)
    }
  }

  return rows
}

/**
 * Parses a CSV string into an array of objects keyed by the header row.
 * Empty values become empty strings. Extra columns are ignored.
 */
export function csvToObjects(text: string): Record<string, string>[] {
  const rows = parseCsv(text)
  if (rows.length < 2) return []

  const [headers, ...dataRows] = rows
  return dataRows.map(row =>
    Object.fromEntries(headers.map((h, i) => [h.trim(), (row[i] ?? '').trim()]))
  )
}

/**
 * Fetches a Google Sheets published CSV URL and returns parsed row objects.
 * Throws on HTTP error.
 */
export async function fetchSheetCsv(url: string): Promise<Record<string, string>[]> {
  const res = await fetch(url, {
    next: { revalidate: 60 },
    headers: { Accept: 'text/csv' },
  })

  if (!res.ok) {
    throw new Error(`Sheets CSV fetch failed: ${res.status} ${res.statusText}`)
  }

  const text = await res.text()
  return csvToObjects(text)
}
