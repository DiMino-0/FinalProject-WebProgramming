import { ref } from 'vue'
import type { Post } from './post'

export interface User {
  uid: number
  username: string
  email: string
  password: string
  role: string
  posts: Post[]
}

export function refUser() {
  return ref<User>()
}
