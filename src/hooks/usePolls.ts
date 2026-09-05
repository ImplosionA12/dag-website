'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Poll, PollsResponse } from '@/types/polls'
import { FetchState } from '@/types'

const REFRESH_INTERVAL = 30_000

export function usePolls(): FetchState<Poll[]> & { refetch: () => void } {
  const [state, setState] = useState<FetchState<Poll[]>>({
    data: null,
    loading: true,
    error: null,
  })

  const cancelled = useRef(false)

  const load = useCallback(() => {
    fetch('/api/polls', { cache: 'no-store' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<PollsResponse>
      })
      .then(json => {
        if (!cancelled.current) {
          setState({ data: json.polls ?? [], loading: false, error: null })
        }
      })
      .catch(err => {
        if (!cancelled.current) {
          setState({ data: null, loading: false, error: err.message })
        }
      })
  }, [])

  useEffect(() => {
    cancelled.current = false
    load()
    const timer = setInterval(load, REFRESH_INTERVAL)

    return () => {
      cancelled.current = true
      clearInterval(timer)
    }
  }, [load])

  // Exposed so a card can pull fresh tallies straight after a vote instead of leaving the
  // voter looking at their own click for up to 30 seconds.
  return { ...state, refetch: load }
}
