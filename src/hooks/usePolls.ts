'use client'

import { useEffect, useState } from 'react'
import { Poll, PollsResponse } from '@/types/polls'
import { FetchState } from '@/types'

const REFRESH_INTERVAL = 30_000

export function usePolls(): FetchState<Poll[]> {
  const [state, setState] = useState<FetchState<Poll[]>>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    function load() {
      fetch('/api/polls')
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return res.json() as Promise<PollsResponse>
        })
        .then(json => {
          if (!cancelled) {
            setState({ data: json.polls ?? [], loading: false, error: null })
          }
        })
        .catch(err => {
          if (!cancelled) {
            setState({ data: null, loading: false, error: err.message })
          }
        })
    }

    load()
    const timer = setInterval(load, REFRESH_INTERVAL)

    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [])

  return state
}
