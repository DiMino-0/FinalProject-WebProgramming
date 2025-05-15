import type { DataListEnvelope } from './dataEnvelope'
import type { Post } from './post'
import type { Comment } from './comment'
import { api, apiCustomMethod, apiDelete } from './session'

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

export function deleteUser(id: number): Promise<User> {
  return apiDelete(`users/${id}`)
}

export function createUser(user: User): Promise<User> {
  return apiCustomMethod('users', 'POST', {
    method: 'POST',
    body: JSON.stringify(user),
  })
}

export function search(query: string): Promise<DataListEnvelope<User>> {
  return api(`users/search/${query}`)
}

export function updateUser(id: number, userData: Partial<User>): Promise<User> {
  return apiCustomMethod(`users/${id}`, 'PATCH', userData)
}
