import { ref } from 'vue'
import type { ActivityEntry } from './ActivityEntry'
import { initializeUserEntries } from './ActivityEntry'

export interface User {
  uid: number
  username: string
  email: string
  password: string
  role: string
  entries: ActivityEntry[]
}

class UserManager {
  private static instance: UserManager
  private userID: number = 1
  private roles = ['admin', 'user']
  private defaultRole = 'user'
  private listOfUsers = ref<User[]>([])
  private currentUser = ref<User | null>(null)

  private constructor() {
    // Initialize with default users
    this.listOfUsers.value = [
      {
        uid: -1,
        username: 'JohnAdmin',
        email: 'johnadmin@temporary.com',
        password: 'admin1234',
        role: 'admin',
        entries: [],
      },
      {
        uid: -2,
        username: 'JohnUser',
        email: 'johnuser@temporary.com',
        password: 'user1234',
        role: 'user',
        entries: [],
      },
    ]
    this.currentUser.value = null

    // Delay initialization to prevent potential circular dependency issues
    setTimeout(() => {
      this.initializeDefaultUserEntries()
    }, 0)
  }

  // New method to initialize entries separately from constructor
  private initializeDefaultUserEntries() {
    try {
      initializeUserEntries(-1)
      initializeUserEntries(-2)
    } catch (error) {
      console.error('Error initializing user entries:', error)
    }
  }

  static getInstance(): UserManager {
    if (!UserManager.instance) {
      UserManager.instance = new UserManager()
    }
    return UserManager.instance
  }

  private generateID(): number {
    // Changed to return a unique positive ID that won't conflict with predefined negative IDs
    return this.userID++
  }

  getUserByID(uid: number): User | null {
    return this.listOfUsers.value.find((user) => user.uid === uid) || null
  }

  getUsers() {
    return this.listOfUsers
  }

  getCurrentUser() {
    return this.currentUser
  }

  setCurrentUser(user: User | null) {
    this.currentUser.value = user
  }

  addUser(username: string, email: string, password: string, role?: string) {
    const uid = this.generateID()
    this.listOfUsers.value.push({
      uid,
      username,
      email,
      password,
      role: role || this.defaultRole,
      entries: [],
    })
    return uid // Return the new user ID
  }

  // New method to add an entry to a specific user
  addEntryToUser(userId: number, entry: ActivityEntry) {
    const user = this.getUserByID(userId)
    if (user) {
      user.entries.push(entry)
      return true
    }
    return false
  }

  // New method to remove an entry from a specific user
  removeEntryFromUser(userId: number, entryId: number) {
    const user = this.getUserByID(userId)
    if (user) {
      const index = user.entries.findIndex((e) => e.id === entryId)
      if (index !== -1) {
        user.entries.splice(index, 1)
        return true
      }
    }
    return false
  }

  removeUser(uid: number) {
    this.listOfUsers.value = this.listOfUsers.value.filter((user) => user.uid !== uid)
  }
}

// Export wrapper functions
export function refUsers() {
  return UserManager.getInstance().getUsers()
}

export function getUserByID(uid: number): User | null {
  return UserManager.getInstance().getUserByID(uid)
}

export function getAllUsers(): User[] {
  return UserManager.getInstance().getUsers().value
}

export function refGetCurrentUser() {
  return UserManager.getInstance().getCurrentUser()
}

export function setCurrentUser(user: User | null) {
  UserManager.getInstance().setCurrentUser(user)
}

export function addUser(username: string, email: string, password: string, role?: string) {
  return UserManager.getInstance().addUser(username, email, password, role)
}

export function removeUser(uid: number) {
  UserManager.getInstance().removeUser(uid)
}

export function addEntryToUser(userId: number, entry: ActivityEntry) {
  return UserManager.getInstance().addEntryToUser(userId, entry)
}

export function removeEntryFromUser(userId: number, entryId: number) {
  return UserManager.getInstance().removeEntryFromUser(userId, entryId)
}
