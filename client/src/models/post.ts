import type { DataListEnvelope } from './dataEnvelope'
import { api } from './session'

export interface Post {
  id: number
  user_id: number
  post_message: string
  title: string
  date: string
  type_of_activity: string
  duration: string
  location?: string
  image_url?: string
  created_on: string
  comments?: Comment[]
}

export function getAll(): Promise<DataListEnvelope<Post>> {
  return api(`posts`)
}
export function getAllByUserId(id: number): Promise<DataListEnvelope<Post>> {
  return api(`posts/user/${id}`)
}
