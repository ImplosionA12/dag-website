'use client'

import { useEffect, useState, useCallback } from 'react'
import { LeaderboardEntry, FetchState } from '@/types'

export function useLeaderboards(): FetchState<LeaderboardEntry[]> & { refetch: () => void } {
  const [state, setState] = useState<FetchState<LeaderboardEntry[]>>({
    data: null,
    loading: true,
    error: null,
  })

  const fetchLeaderboards = useCallback(() => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    let cancelled = false

    fetch('/api/leaderboards')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(json => {
        if (!cancelled) {
          const leaderboards = Array.isArray(json.leaderboards) ? json.leaderboards : []
          setState({ data: leaderboards, loading: false, error: null })
        }
      })
      .catch(err => {
        if (!cancelled) {
          setState({ data: null, loading: false, error: err.message })
        }
      })

    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    return fetchLeaderboards()
  }, [fetchLeaderboards])

  return { ...state, refetch: fetchLeaderboards }
}
