<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { requireAdmin } from '@/models/auth'
import { addUser as addUserModel, refUsers, getUserByID } from '@/models/User'
import { refGetUserEntries } from '@/models/ActivityEntry'

const canAccess = ref(false)
const users = refUsers()
const selectedUserId = ref<number | null>(null)
const showAddUserModal = ref(false)
const permissionMessage = ref('')

// Form for adding new user
const newUser = ref({
  username: '',
  email: '',
  password: '',
  role: 'user',
})

// Selected user's activities
const selectedUserEntries = computed(() => {
  if (selectedUserId.value === null) return []
  const entries = refGetUserEntries(selectedUserId.value)
  const result = Array.isArray(entries) ? entries : entries.value || []
  return result as any[] // Type assertion to ensure length property is recognized
})

// Selected user details
const selectedUser = computed(() => {
  if (selectedUserId.value === null) return null
  return getUserByID(selectedUserId.value)
})

// Permission check interval
let permissionCheckInterval: number | null = null

// Function to verify admin permissions
const checkAdminPermission = () => {
  const hasAccess = requireAdmin()

  // If permissions changed from allowed to denied
  if (canAccess.value && !hasAccess) {
    permissionMessage.value = 'Your admin privileges have been revoked.'
  }

  canAccess.value = hasAccess
}

onMounted(() => {
  canAccess.value = requireAdmin()

  // Set up periodic permission checks (every .5 seconds)
  permissionCheckInterval = window.setInterval(checkAdminPermission, 500)
})

onUnmounted(() => {
  // Clean up interval when component is destroyed
  if (permissionCheckInterval !== null) {
    clearInterval(permissionCheckInterval)
  }
})

const openAddUserModal = () => {
  showAddUserModal.value = true
}

const addUser = () => {
  if (newUser.value.username && newUser.value.email && newUser.value.password) {
    addUserModel(
      newUser.value.username,
      newUser.value.email,
      newUser.value.password,
      newUser.value.role,
    )
    showAddUserModal.value = false
    // Reset form
    newUser.value = {
      username: '',
      email: '',
      password: '',
      role: 'user',
    }
  }
}

const viewUserActivities = (uid: number) => {
  selectedUserId.value = uid
}

const backToUserList = () => {
  selectedUserId.value = null
}
</script>

<template>
  <main>
    <div class="admin body-container" v-if="canAccess">
      <h1 class="title is-1 has-text-black">Admin Panel</h1>

      <!-- User management section -->
      <div v-if="selectedUserId === null">
        <button class="button is-primary" @click="openAddUserModal">
          <span class="icon is-small"><i class="fas fa-plus"></i></span>
          <span>Add User</span>
        </button>

        <section class="container mt-4">
          <table class="table is-fullwidth">
            <thead>
              <tr>
                <th>UID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Activities</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.uid">
                <td>{{ user.uid }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
                <td>{{ user.entries.length }}</td>
                <td>
                  <button class="button is-small is-info" @click="viewUserActivities(user.uid)">
                    View Activities
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>

      <!-- User activities section -->
      <div v-else>
        <button class="button is-info mb-4" @click="backToUserList">
          <span class="icon"><i class="fas fa-arrow-left"></i></span>
          <span>Back to User List</span>
        </button>

        <div v-if="selectedUserEntries.length === 0" class="notification is-info">
          This user hasn't logged any activities yet.
        </div>
      </div>
    </div>

    <div v-else>
      <p class="has-text-danger">You are not authorized to access this page.</p>
      <p v-if="permissionMessage" class="has-text-warning mt-2">{{ permissionMessage }}</p>
    </div>
  </main>
</template>

<style scoped>
.admin {
  padding: 1rem;
}
</style>
