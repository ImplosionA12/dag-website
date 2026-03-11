'use client'

import { useEffect, useState } from 'react'
import { LeaderboardEntry, FetchState } from '@/types'

export function useLeaderboards(): FetchState<LeaderboardEntry[]> {
  const [state, setState] = useState<FetchState<LeaderboardEntry[]>>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    fetch('/api/leaderboards')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(json => {
        if (!cancelled) {
          setState({ data: json.leaderboards ?? [], loading: false, error: null })
        }
      })
      .catch(err => {
        if (!cancelled) {
          setState({ data: null, loading: false, error: err.message })
        }
      })

    return () => { cancelled = true }
  }, [])

  return state
}
