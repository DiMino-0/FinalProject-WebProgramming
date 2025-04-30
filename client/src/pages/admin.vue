<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { type User, getAll as getAllUsers } from '@/models/users'
import { refSession } from '@/models/session'
import { type Post } from '@/models/post'
import { type Comment } from '@/models/comment'

const users = ref(<User[]>[])
const posts = ref(<Post[]>[])
const comments = ref(<Comment[]>[])

const session = refSession()

// Fetch users if currently logged in user is an admin
watchEffect(() => {
  if (session.value.user?.role === 'admin') {
    getAllUsers().then((response) => {
      users.value = response.items
      posts.value = response.items.flatMap((user) => user.posts ?? [])
      comments.value = response.items.flatMap((user) => user.comments ?? [])
    })
  }
})
</script>
<!-- TODO: Should be able to view and modify any/all users/posts/comments/friendships in one centralized place as an admin-->
<template>
  <main>
    <div class="admin body-container">
      <h1 class="title is-1 has-text-black">Admin Panel</h1>

      <!-- User management section -->
      <div>
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
                <th>Posts</th>
                <th>Comments</th>
              </tr>
            </thead>
          </table>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>
.admin {
  padding: 1rem;
}
</style>
