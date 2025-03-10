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

// Keep this as sample data for new users
const sampleEntries: ActivityEntry[] = [
  {
    id: 1,
    title: 'Climbing Everest',
    date: '2025-03-10',
    duration: '2 hours',
    location: 'Mount Everest',
    picture: '/bike.png',
    type: 'Hiking',
  },
  {
    id: 2,
    title: 'Crossing the Ocean!',
    date: '2025-03-06',
    duration: '1 hour',
    location: 'Pacific Ocean',
    picture: '/bike.png',
    type: 'Swimming',
  },
  {
    id: 3,
    title: 'Running in the park -_-',
    date: '2021-10-12',
    duration: '1 hour',
    location: 'Central Park',
    picture: '/bike.png',
    type: 'Running',
  },
]

// Maintain a counter for unique IDs across all entries
let nextEntryId = 4 // Start after the sample entries

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

// Add entry to current user's entries
export function addEntry(entry: Omit<ActivityEntry, 'id'>) {
  const currentUser = refGetCurrentUser()
  if (currentUser.value) {
    const newEntry = {
      ...entry,
      id: nextEntryId++,
    }
    currentUser.value.entries.push(newEntry)
    return newEntry
  }
  return null
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

// Initialize a new user with sample entries
export function initializeUserEntries(userId: number) {
  const user = getUserByID(userId)
  if (user && user.entries.length === 0) {
    // Clone sample entries to avoid reference issues
    user.entries = JSON.parse(JSON.stringify(sampleEntries))
  }
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
