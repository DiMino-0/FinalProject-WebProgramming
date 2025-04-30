import type { DataListEnvelope } from './dataEnvelope'
import type { Post } from './post'
import type { Comment } from './comment'
import { api } from './session'

export interface User {
  id: number
  username: string
  email: string
  role: string
  birth_date?: string
  gender?: string
  pfp_image_url?: string
  posts?: Post[]
  comments?: Comment[]
}

export function getAll(): Promise<DataListEnvelope<User>> {
  return api('users')
}

export function get(id: number): Promise<User> {
  return api(`users/${id}`)
}
