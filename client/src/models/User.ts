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
  static listOfUsers = ref<User[]>([
    {
      id: -1,
      username: 'JohnAdmin',
      email: 'johnadmin@temporary.com',
      password: 'admin1234',
      role: 'admin',
    },
  ])

  static generateID() {
    return this.userID++
  }
}

export function refUsers() {
  return UserManager.listOfUsers
}

export function addUser(username: string, email: string, password: string, role?: string) {
  const id = UserManager.generateID()
  UserManager.listOfUsers.value.push({
    id,
    username,
    email,
    password,
    role: role || UserManager.defaultRole,
  })
}

export function removeUser(id: number) {
  UserManager.listOfUsers.value = UserManager.listOfUsers.value.filter((user) => user.id !== id)
}
