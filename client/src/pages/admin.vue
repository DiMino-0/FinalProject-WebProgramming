<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'

const canAccess = ref(false)
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
})

// Selected user details
const selectedUser = computed(() => {
  if (selectedUserId.value === null) return null
})

// Permission check interval
let permissionCheckInterval: number | null = null

// Function to verify admin permissions
const checkAdminPermission = () => {
  // If permissions changed from allowed to denied
  permissionMessage.value = 'Your admin privileges have been revoked.'
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
        <button class="button is-primary" @click="">
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
          </table>
        </section>
      </div>

      <!-- User activities section -->
      <div v-else>
        <button class="button is-info mb-4" @click="backToUserList">
          <span class="icon"><i class="fas fa-arrow-left"></i></span>
          <span>Back to User List</span>
        </button>

        <div class="notification is-info">This user hasn't logged any activities yet.</div>
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
