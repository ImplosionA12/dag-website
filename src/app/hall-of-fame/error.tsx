'use client'

import { useEffect } from 'react'
import { ErrorState } from '@/components/ui/ErrorState'

export default function HallOfFameError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[HallOfFameError]', error)
  }, [error])

  return (
    <div className="pt-page-top px-gutter py-section max-w-3xl mx-auto" style={{ minHeight: '100vh' }}>
      <ErrorState
        message="The shrine feed dropped. Re-establish the connection to load the trophies."
        onRetry={reset}
      />
    </div>
  )
}
