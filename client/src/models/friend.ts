import { api, apiCustomMethod } from './session'
import type { DataListEnvelope } from './dataEnvelope'

export interface Friend {
  id: number
  user_initiated_id: number
  status: 'pending' | 'accepted' | 'rejected'
  user_accepted_id: number
  created_at: string
}

export function getAll(): Promise<DataListEnvelope<Friend>> {
  return api('friends')
}

// function to patch a friendship
export function updateFriend(id: number, friend: Partial<Friend>): Promise<Friend> {
  return apiCustomMethod(`friends/${id}`, 'PATCH', friend)
}
