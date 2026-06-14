'use client'

import { useEffect, useState, useCallback } from 'react'
import { HallOfFameEntry, FetchState } from '@/types'

export function useHallOfFame(): FetchState<HallOfFameEntry[]> & { refetch: () => void } {
  const [state, setState] = useState<FetchState<HallOfFameEntry[]>>({
    data: null,
    loading: true,
    error: null,
  })

  const fetchHallOfFame = useCallback(() => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    let cancelled = false

    fetch('/api/hall-of-fame')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(json => {
        if (!cancelled) {
          const hall_of_fame = Array.isArray(json.hall_of_fame) ? json.hall_of_fame : []
          setState({ data: hall_of_fame, loading: false, error: null })
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
    return fetchHallOfFame()
  }, [fetchHallOfFame])

  return { ...state, refetch: fetchHallOfFame }
}
