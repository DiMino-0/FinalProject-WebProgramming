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
  static userID: number = 0
  static roles = ['admin', 'user']
  static defaultRole = 'user'
  static listOfUsers = ref<User[]>([
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
  ])
  static currentUser = ref<User | null>(getUserByID(-1))

  static generateID() {
    return this.userID++
  }
}

export function refUsers() {
  return UserManager.listOfUsers
}

export function getUserByID(uid: number): User | null {
  return UserManager.listOfUsers.value.find((user) => user.uid === uid) || null
}

export function refGetCurrentUser() {
  return UserManager.currentUser
}

export function setCurrentUser(user: User) {
  UserManager.currentUser.value = user
}

export function addUser(username: string, email: string, password: string, role?: string) {
  const uid = UserManager.generateID()
  UserManager.listOfUsers.value.push({
    uid,
    username,
    email,
    password,
    role: role || UserManager.defaultRole,
    entries: [],
  })
}

export function removeUser(uid: number) {
  UserManager.listOfUsers.value = UserManager.listOfUsers.value.filter((user) => user.uid !== uid)
}
