import { ref } from 'vue'

export interface Post {
  id: number
  title: string
  date: string
  duration: string
  location?: string
  picture?: string
  type: string
}
