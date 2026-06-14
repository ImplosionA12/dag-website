'use client'

import { useEffect } from 'react'
import { ErrorState } from '@/components/ui/ErrorState'

export default function EventsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[EventsError]', error)
  }, [error])

  return (
    <div className="pt-page-top px-gutter py-section max-w-3xl mx-auto" style={{ minHeight: '100vh' }}>
      <ErrorState
        message="The events feed dropped. Re-establish the connection to load the mission board."
        onRetry={reset}
      />
    </div>
  )
}
