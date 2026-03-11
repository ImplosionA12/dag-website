'use client'

import { useEffect, useState } from 'react'
import { HallOfFameEntry, FetchState } from '@/types'

export function useHallOfFame(): FetchState<HallOfFameEntry[]> {
  const [state, setState] = useState<FetchState<HallOfFameEntry[]>>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    fetch('/api/hall-of-fame')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(json => {
        if (!cancelled) {
          setState({ data: json.hall_of_fame ?? [], loading: false, error: null })
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
