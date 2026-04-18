import axios from 'axios'
import type { RRGRequest, RRGResponse } from '../types'

const api = axios.create({ baseURL: '' })

export const computeRRG = (req: RRGRequest): Promise<RRGResponse> =>
  api.post<RRGResponse>('/rrg/compute', req).then(r => r.data)

export const getSectorRRG = (period = '1y', tail_length = 5): Promise<RRGResponse> =>
  api.post<RRGResponse>(`/rrg/sectors/india?period=${period}&tail_length=${tail_length}`).then(r => r.data)
