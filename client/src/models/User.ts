import { ref } from 'vue'

interface User {
  id: number
  username: string
  email: string
  password: string
  role: string
}

class UserManager {
  static userID: number = 0
  static roles = ['admin', 'user']
  static defaultRole = 'user'

  static generateID() {
    return this.userID++
  }
}

const listOfUsers = ref<User[]>([])

export function refUsers() {
  return listOfUsers
}

export function addUser(username: string, email: string, password: string, role?: string) {
  const id = UserManager.generateID()
  listOfUsers.value.push({ id, username, email, password, role: role || UserManager.defaultRole })
}

export function removeUser(id: number) {
  listOfUsers.value = listOfUsers.value.filter((user) => user.id !== id)
}
