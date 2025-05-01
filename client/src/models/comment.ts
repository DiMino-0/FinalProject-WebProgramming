import { api } from './session'
import type { DataListEnvelope } from './dataEnvelope'

export interface Comment {
  id: number
  comment_message: string
  user_id: number
  post_id: number
  created_on: string
}

export function getAllComments(): Promise<DataListEnvelope<Comment>> {
  return api('comments')
}
