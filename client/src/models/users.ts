import type { DataListEnvelope } from './dataEnvelope'
import { api } from './session'

export interface User {
  id: number
  username: string
  email: string
  role: string
  birth_date?: string
  gender?: string
  pfp_image_url?: string
}

export function getAll(): Promise<DataListEnvelope<User>> {
  return api('users')
}

export function get(id: number): Promise<User> {
  return api(`users/${id}`)
}
