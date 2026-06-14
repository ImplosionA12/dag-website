'use client'

import { useEffect, useState, useCallback } from 'react'
import { Event, FetchState } from '@/types'

export function useEvents(): FetchState<Event[]> & { refetch: () => void } {
  const [state, setState] = useState<FetchState<Event[]>>({
    data: null,
    loading: true,
    error: null,
  })

  const fetchEvents = useCallback(() => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    let cancelled = false

    fetch('/api/events')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(json => {
        if (!cancelled) {
          const events = Array.isArray(json.events) ? json.events : []
          setState({ data: events, loading: false, error: null })
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
    return fetchEvents()
  }, [fetchEvents])

  return { ...state, refetch: fetchEvents }
}
