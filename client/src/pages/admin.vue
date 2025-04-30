<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

const canAccess = ref(false)
const selectedUserId = ref<number | null>(null)
const permissionMessage = ref('')
</script>
<!-- TODO: Should be able to view and modify any/all users/posts/comments/friendships in one centralized place as an admin-->
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
    </div>
    <!-- Users posts/comments section -->
  </main>
</template>

<style scoped>
.admin {
  padding: 1rem;
}
</style>
