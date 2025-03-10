import { ref } from 'vue'
import type { ActivityEntry } from './ActivityEntry'

interface User {
  uid: number
  username: string
  email: string
  password: string
  role: string
  entries: ActivityEntry[]
}

class UserManager {
  private static instance: UserManager
  private userID: number = 0
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
    this.currentUser.value = this.getUserByID(-1)
  }

  static getInstance(): UserManager {
    if (!UserManager.instance) {
      UserManager.instance = new UserManager()
    }
    return UserManager.instance
  }

  private generateID(): number {
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

  setCurrentUser(user: User) {
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

export function refGetCurrentUser() {
  return UserManager.getInstance().getCurrentUser()
}

export function setCurrentUser(user: User) {
  UserManager.getInstance().setCurrentUser(user)
}

export function addUser(username: string, email: string, password: string, role?: string) {
  UserManager.getInstance().addUser(username, email, password, role)
}

export function removeUser(uid: number) {
  UserManager.getInstance().removeUser(uid)
}
