import { useState, useCallback } from 'react'
import { computeRRG, getSectorRRG } from '../api/rrg'
import type { RRGResponse, RRGRequest } from '../types'

export function useRRG() {
  const [data, setData]       = useState<RRGResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const fetch = useCallback(async (req: RRGRequest) => {
    setLoading(true); setError(null)
    try   { setData(await computeRRG(req)) }
    catch (e: any) { setError(e?.response?.data?.detail || 'Failed to fetch RRG data.') }
    finally { setLoading(false) }
  }, [])

  const fetchSectors = useCallback(async (period: string, tailLength: number) => {
    setLoading(true); setError(null)
    try   { setData(await getSectorRRG(period, tailLength)) }
    catch (e: any) { setError(e?.response?.data?.detail || 'Failed to fetch sector data.') }
    finally { setLoading(false) }
  }, [])

  return { data, loading, error, fetch, fetchSectors }
}
