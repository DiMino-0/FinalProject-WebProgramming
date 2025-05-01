<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { type User, getAll as getAllUsers, deleteUser as apiDeleteUser } from '@/models/users'
import { refSession, isAdmin } from '@/models/session'
import { type Post } from '@/models/post'
import { type Comment } from '@/models/comment'
import { type Friend, getAll as getAllFriends } from '@/models/friend'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

const users = ref(<User[]>[])
const posts = ref(<Post[]>[])
const comments = ref(<Comment[]>[])
const friendships = ref(<Friend[]>[])
const isLoading = ref(false)
const activeTab = ref('users')
const notification = ref({ message: '', type: '', show: false })

const session = refSession()

const deleteUser = async (userId: number) => {
  if (!confirm(`Are you sure you want to delete user #${userId}?`)) {
    return
  }

  try {
    isLoading.value = true
    await apiDeleteUser(userId)
      .then(() => {
        users.value = users.value.filter((user) => user.id !== userId)

        posts.value = posts.value.filter((post) => post.user_id !== userId)

        comments.value = comments.value.filter((comment) => comment.user_id !== userId)

        friendships.value = friendships.value.filter(
          (friendship) =>
            friendship.user_initiated_id !== userId && friendship.user_accepted_id !== userId,
        )

        showNotification('User deleted successfully', 'is-success')
      })
      .catch((error) => {
        console.error('Failed to delete user:', error)
        showNotification('Failed to delete user', 'is-danger')
      })
      .finally(() => {
        isLoading.value = false
      })
  } catch (error) {
    console.error('Error in delete operation:', error)
    showNotification('An unexpected error occurred', 'is-danger')
    isLoading.value = false
  }
}

const showNotification = (message: string, type: string) => {
  notification.value = { message, type, show: true }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

// Fetch users if currently logged in user is an admin
watchEffect(() => {
  if (isAdmin()) {
    isLoading.value = true
    getAllUsers()
      .then((response) => {
        users.value = response.items
        posts.value = response.items.flatMap((user) => user.posts ?? [])
        comments.value = response.items.flatMap((user) => user.comments ?? [])
        isLoading.value = false
      })
      .catch((error) => {
        console.error('Failed to fetch:', error)
      })
    getAllFriends()
      .then((response) => {
        // Extract items array from the response
        friendships.value = response.items || []
      })
      .catch((error) => {
        console.error('Failed to fetch friendships:', error)
      })
  }
})

const getUsernameById = (userId: number): string => {
  const user = users.value.find((u) => u.id === userId)
  return user ? user.username : `User #${userId}`
}

dayjs.extend(relativeTime)
</script>

<template>
  <main>
    <div class="admin body-container">
      <h1 class="title is-1 has-text-black">Admin Panel</h1>

      <!-- Notification component -->
      <div v-if="notification.show" class="notification" :class="notification.type">
        <button class="delete" @click="notification.show = false"></button>
        {{ notification.message }}
      </div>

      <div v-if="!isAdmin()" class="notification is-warning">
        <p class="has-text-centered">
          <i class="fas fa-exclamation-triangle mr-2"></i>
          You need admin permissions to access this page.
        </p>
      </div>

      <div v-else>
        <!-- Navigation tabs -->
        <div class="tabs is-boxed">
          <ul>
            <li :class="{ 'is-active': activeTab === 'users' }">
              <a @click="activeTab = 'users'">
                <span class="icon is-small"><i class="fas fa-users"></i></span>
                <span>Users ({{ users.length }})</span>
              </a>
            </li>
            <li :class="{ 'is-active': activeTab === 'posts' }">
              <a @click="activeTab = 'posts'">
                <span class="icon is-small"><i class="fas fa-file-alt"></i></span>
                <span>Posts ({{ posts.length }})</span>
              </a>
            </li>
            <li :class="{ 'is-active': activeTab === 'comments' }">
              <a @click="activeTab = 'comments'">
                <span class="icon is-small"><i class="fas fa-comments"></i></span>
                <span>Comments ({{ comments.length }})</span>
              </a>
            </li>
            <li :class="{ 'is-active': activeTab === 'friendships' }">
              <a @click="activeTab = 'friendships'">
                <span class="icon is-small"><i class="fas fa-handshake"></i></span>
                <span>Friendships ({{ friendships.length }})</span>
              </a>
            </li>
          </ul>
        </div>

        <div v-if="isLoading" class="has-text-centered p-5">
          <span class="icon is-large">
            <i class="fas fa-spinner fa-pulse fa-2x"></i>
          </span>
          <p class="is-size-4 mt-2">Loading data...</p>
        </div>

        <!-- Users Tab Content -->
        <div v-else-if="activeTab === 'users'" class="tab-content">
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                <h2 class="subtitle">Manage Users</h2>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <button class="button is-primary">
                  <span class="icon is-small"><i class="fas fa-plus"></i></span>
                  <span>Add User</span>
                </button>
              </div>
            </div>
          </div>

          <div class="table-container">
            <table class="table is-fullwidth is-striped is-hoverable">
              <thead>
                <tr>
                  <th>UID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Posts</th>
                  <th>Comments</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>
                    <div class="is-flex is-align-items-center">
                      <figure class="image is-32x32 mr-2" v-if="user.pfp_image_url">
                        <img :src="user.pfp_image_url" class="is-rounded" alt="Profile" />
                      </figure>
                      {{ user.username }}
                    </div>
                  </td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span class="tag" :class="user.role === 'admin' ? 'is-danger' : 'is-info'">{{
                      user.role
                    }}</span>
                  </td>
                  <td>{{ user.posts?.length || 0 }}</td>
                  <td>{{ user.comments?.length || 0 }}</td>
                  <td>
                    <div class="buttons are-small">
                      <button class="button is-link is-outlined">
                        <span class="icon is-small"><i class="fas fa-edit"></i></span>
                      </button>
                      <button
                        class="button is-danger is-outlined"
                        @click="deleteUser(user.id)"
                        :disabled="user.role === 'admin' || user.id === session.user?.id"
                        :title="
                          user.role === 'admin'
                            ? 'Cannot delete admin users'
                            : user.id === session.user?.id
                              ? 'Cannot delete your own account'
                              : 'Delete user'
                        "
                      >
                        <span class="icon is-small"><i class="fas fa-trash"></i></span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Posts Tab Content -->
        <div v-else-if="activeTab === 'posts'" class="tab-content">
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                <h2 class="subtitle">Manage Posts</h2>
              </div>
            </div>
          </div>

          <div class="table-container">
            <table class="table is-fullwidth is-striped is-hoverable">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Author</th>
                  <th>Title</th>
                  <th>Content</th>
                  <th>Activity Type</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="post in posts" :key="post.id">
                  <td>{{ post.id }}</td>
                  <td>{{ getUsernameById(post.user_id) }}</td>
                  <td>{{ post.title }}</td>
                  <td>
                    {{
                      post.post_message.substring(0, 50) +
                      (post.post_message.length > 50 ? '...' : '')
                    }}
                  </td>
                  <td>
                    <span class="tag is-primary">{{ post.type_of_activity }}</span>
                  </td>
                  <td>{{ dayjs(post.created_on).fromNow() }}</td>
                  <td>
                    <div class="buttons are-small">
                      <button class="button is-link is-outlined">
                        <span class="icon is-small"><i class="fas fa-edit"></i></span>
                      </button>
                      <button class="button is-danger is-outlined">
                        <span class="icon is-small"><i class="fas fa-trash"></i></span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Comments Tab Content -->
        <div v-else-if="activeTab === 'comments'" class="tab-content">
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                <h2 class="subtitle">Manage Comments</h2>
              </div>
            </div>
          </div>

          <div class="table-container">
            <table class="table is-fullwidth is-striped is-hoverable">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Author</th>
                  <th>Comment</th>
                  <th>Post ID</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="comment in comments" :key="comment.id">
                  <td>{{ comment.id }}</td>
                  <td>{{ getUsernameById(comment.user_id) }}</td>
                  <td>{{ comment.comment_message }}</td>
                  <td>{{ comment.post_id }}</td>
                  <td>{{ dayjs(comment.created_on).fromNow() }}</td>
                  <td>
                    <div class="buttons are-small">
                      <button class="button is-link is-outlined">
                        <span class="icon is-small"><i class="fas fa-edit"></i></span>
                      </button>
                      <button class="button is-danger is-outlined">
                        <span class="icon is-small"><i class="fas fa-trash"></i></span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Friendships Tab Content -->
        <div v-else-if="activeTab === 'friendships'" class="tab-content">
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                <h2 class="subtitle">Manage Friendships</h2>
              </div>
            </div>
          </div>

          <div class="table-container">
            <table class="table is-fullwidth is-striped is-hoverable">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User Initiated</th>
                  <th>User Accepted</th>
                  <th>Created On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="friendship in friendships" :key="friendship.id">
                  <td>{{ friendship.id }}</td>
                  <td>{{ getUsernameById(friendship.user_initiated_id) }}</td>
                  <td>{{ getUsernameById(friendship.user_accepted_id) }}</td>
                  <td>{{ dayjs(friendship.created_at).fromNow() }}</td>
                  <td>
                    <div class="buttons are-small">
                      <button class="button is-danger is-outlined">
                        <span class="icon is-small"><i class="fas fa-trash"></i></span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.admin {
  padding: 1rem;
}

.table-container {
  overflow-x: auto;
}

.tabs {
  margin-bottom: 1.5rem;
}

.tab-content {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.image.is-32x32 img {
  height: 32px;
  width: 32px;
  object-fit: cover;
}

.notification {
  margin-bottom: 1rem;
  transition: opacity 0.3s ease-in-out;
}
</style>
