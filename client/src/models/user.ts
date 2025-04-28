import { ref } from 'vue'
import type { ActivityEntry } from './activityEntry'

export interface User {
  uid: number
  username: string
  email: string
  password: string
  role: string
  entries: ActivityEntry[]
}

export function refUser() {
  return ref<User>({
    uid: 0,
    username: '',
    email: '',
    password: '',
    role: 'user',
    entries: [],
  })
}
