/**
 * The browser talks to Supabase directly when casting a vote, so its origin has to be in
 * connect-src. Derived from the configured URL rather than hardcoded, and narrowed to the
 * origin so the policy names one project rather than all of supabase.co. Empty when
 * Supabase is unconfigured, which leaves the policy exactly as it was.
 */
const supabaseOrigin = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin
      : ''
  } catch {
    return ''
  }
})()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove X-Powered-By header
  poweredByHeader: false,

  // Allow importing Three.js and other ESM-only packages
  experimental: {
    esmExternals: 'loose',
  },

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "media-src 'self'",
              [
                "connect-src 'self' https://docs.google.com https://api.jsonbin.io",
                supabaseOrigin,
              ]
                .filter(Boolean)
                .join(' '),
              "frame-ancestors 'none'",
              "base-uri 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
