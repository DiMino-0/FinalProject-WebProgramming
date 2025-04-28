import { ref } from 'vue'
import { refGetCurrentUser, getUserByID, getAllUsers } from './User'

export interface ActivityEntry {
  id: number
  title: string
  date: string
  duration: string
  location?: string
  picture?: string
  type: string
}

// Get entries for the currently logged in user
export function refGetCurrentUserEntries() {
  const currentUser = refGetCurrentUser()
  return ref({
    get value() {
      return currentUser.value?.entries || []
    },
    set value(newEntries) {
      if (currentUser.value) {
        currentUser.value.entries = newEntries
      }
    },
  })
}

// Get entries for a specific user
export function refGetUserEntries(uid: number) {
  const user = getUserByID(uid)
  return ref({
    get value() {
      return user?.entries || []
    },
  })
}

// Delete entry from current user's entries
export function deleteEntry(id: number) {
  const currentUser = refGetCurrentUser()
  if (currentUser.value) {
    const index = currentUser.value.entries.findIndex((entry) => entry.id === id)
    if (index !== -1) {
      currentUser.value.entries.splice(index, 1)
      return true
    }
  }
  return false
}

// Get entries for all users except current user
export function refGetOtherUsersEntries() {
  const allUsers = getAllUsers()
  const currentUser = refGetCurrentUser()

  return ref({
    get value() {
      const allEntries: (ActivityEntry & { username?: string; userId?: number })[] = []

      allUsers.forEach((user) => {
        // Skip the current user's entries
        if (currentUser.value && user.uid === currentUser.value.uid) {
          return
        }

        if (user && user.entries && user.entries.length > 0) {
          // Add username to each entry for display
          const entriesWithUserInfo = user.entries.map((entry) => ({
            ...entry,
            username: user.username,
            userId: user.uid,
          }))

          allEntries.push(...entriesWithUserInfo)
        }
      })

      // Sort by date (newest first)
      return allEntries.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
    },
  })
}
