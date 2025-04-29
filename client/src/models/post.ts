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
}
