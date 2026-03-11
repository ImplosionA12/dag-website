/**
 * Fetches JSON from a URL with 60-second revalidation.
 * Generic utility for server-side fetch calls in API routes.
 */
export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status} ${res.statusText} — ${url}`)
  }

  return res.json() as Promise<T>
}
