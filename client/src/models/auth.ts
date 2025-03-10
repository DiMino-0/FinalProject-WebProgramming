import { refGetCurrentUser } from '@/models/User'

export function isAdmin(): boolean {
  const user = refGetCurrentUser()
  return user.value?.role === 'admin'
}

export function requireAdmin(): boolean {
  if (!isAdmin()) {
    // Could add router.push('/login') here if you want to redirect
    return false
  }
  return true
}
