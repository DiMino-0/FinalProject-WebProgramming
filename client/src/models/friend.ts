import { api } from './session'
import type { DataListEnvelope } from './dataEnvelope'

export interface Friend {
  id: number
  user_initiated_id: number
  user_accepted_id: number
  created_at: string
}

export function getAll(): Promise<DataListEnvelope<Friend>> {
  return api('friends')
}
