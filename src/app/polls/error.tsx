'use client'

import { useEffect } from 'react'
import { ErrorState } from '@/components/ui/ErrorState'

export default function PollsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[PollsError]', error)
  }, [error])

  return (
    <div className="pt-page-top px-gutter py-section max-w-3xl mx-auto" style={{ minHeight: '100vh' }}>
      <ErrorState
        message="The ballot feed dropped. Re-establish the connection to load live votes."
        onRetry={reset}
      />
    </div>
  )
}
