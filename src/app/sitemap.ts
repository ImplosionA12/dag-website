import type { MetadataRoute } from 'next'
import { fetchEventsFeed } from '@/lib/feeds'
import { eventSlug } from '@/lib/utils'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

/**
 * Event dossiers are the only data-driven URLs on the site, so the sitemap has to read the
 * feed to know them. A broken feed drops them rather than failing the build — a sitemap
 * missing rows degrades discovery; a sitemap that throws takes the deploy with it.
 */
async function eventRoutes(): Promise<MetadataRoute.Sitemap> {
  try {
    const events = await fetchEventsFeed()
    return (events ?? []).map(event => ({
      url: `${BASE_URL}/events/${eventSlug(event)}`,
      lastModified: new Date(event.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/leaderboards`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/hall-of-fame`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/polls`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/members`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...(await eventRoutes()),
  ]
}
