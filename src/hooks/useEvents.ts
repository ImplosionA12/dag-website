'use client'

import { useEffect, useState } from 'react'
import { Event, FetchState } from '@/types'

export function useEvents(): FetchState<Event[]> {
  const [state, setState] = useState<FetchState<Event[]>>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    fetch('/api/events')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(json => {
        if (!cancelled) {
          setState({ data: json.events ?? [], loading: false, error: null })
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
