<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { requireAdmin } from '@/models/auth'
import { addUser as addUserModel } from '@/models/User'

const canAccess = ref(false)

onMounted(() => {
  canAccess.value = requireAdmin()
})
const addUser = (event: MouseEvent) => {
  addUserModel('username', 'email', 'password', 'role')
}
</script>

<template>
  <main>
    <div class="admin body-container" v-if="canAccess">
      <h1 class="title is-1 has-text-black">Admin Panel</h1>

      <button class="button is-primary" @click="addUser">
        <span class="icon is-small"><i class="fas fa-plus"></i> </span>
        <span>Add User</span>
      </button>

      <section class="container mt-4">
        <table class="table">
          <thead>
            <tr>
              <th>UID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>-1</td>
              <td>JohnAdmin</td>
              <td>johnadmin@temporary.com</td>
              <td>admin</td>
            </tr>
            <tr>
              <td>-2</td>
              <td>JohnUser</td>
              <td>johnuser@temporary.com</td>
              <td>user</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
    <div class="body-container" v-else>
      <h1 class="title is-1 has-text-black">Access Denied</h1>
      <p class="subtitle">You must be an admin to view this page.</p>
    </div>
  </main>
</template>

<style scoped></style>
