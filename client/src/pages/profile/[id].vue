<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { get as getUser, type User } from '@/models/users'
import { getAllByUserId, type Post } from '@/models/post'
import { apiCustomMethod, refSession, isLoggedIn } from '@/models/session'
import { type Friend, getAll as getAllFriends } from '@/models/friend'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const route = useRoute()
const router = useRouter()
const session = refSession()

const userId = 'id' in route.params ? parseInt(route.params.id as string) : 0
const user = ref<User | null>(null)
const userPosts = ref<Post[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const friendships = ref<Friend[]>([])
const isFriend = ref(false)
const isSendingRequest = ref(false)

// TODO!!: Fully implement the friend request system

// Check if the viewed user is a friend of the current user
const checkFriendshipStatus = () => {
  if (!isLoggedIn() || !session.value.user) return false

  const currentUserId = session.value.user.id
  return friendships.value.some(
    (friendship) =>
      (friendship.user_initiated_id === currentUserId && friendship.user_accepted_id === userId) ||
      (friendship.user_initiated_id === userId && friendship.user_accepted_id === currentUserId),
  )
}

// Send friend request
const sendFriendRequest = async () => {
  if (!isLoggedIn() || !session.value.user) {
    alert('You must be logged in to add friends')
    return
  }

  try {
    isSendingRequest.value = true
    const friendData = {
      user_initiated_id: session.value.user.id,
      user_accepted_id: userId,
    }

    await apiCustomMethod('friends', 'POST', friendData)

    // Refresh friendship status
    await loadFriendships()
    isFriend.value = checkFriendshipStatus()

    alert('Friend request sent successfully!')
  } catch (err) {
    console.error('Error sending friend request:', err)
    alert('Failed to send friend request. Please try again.')
  } finally {
    isSendingRequest.value = false
  }
}

// Load user friendships
const loadFriendships = async () => {
  try {
    const response = await getAllFriends()
    friendships.value = response.items
    isFriend.value = checkFriendshipStatus()
  } catch (err) {
    console.error('Error loading friendships:', err)
  }
}

// Load user data and posts
const loadUserData = async () => {
  isLoading.value = true
  error.value = null

  try {
    // Load user data
    user.value = await getUser(userId)

    // Load user posts
    const postsResponse = await getAllByUserId(userId)
    userPosts.value = postsResponse.items

    // Load friendships to check if user is already a friend
    await loadFriendships()
  } catch (err) {
    console.error('Error loading user profile:', err)
    error.value = 'Failed to load user profile. User may not exist.'
  } finally {
    isLoading.value = false
  }
}

// Go back to previous page
const goBack = () => {
  router.back()
}

// Replace onMounted with watchEffect to check login status
watchEffect(() => {
  // Reset error when login state changes
  error.value = null

  if (isNaN(userId)) {
    error.value = 'Invalid user ID'
    isLoading.value = false
    return
  }

  if (isLoggedIn()) {
    // User is logged in, proceed with loading profile data
    loadUserData()
  } else {
    // User is not logged in, display error message
    error.value = 'You must be logged in to view user profiles'
    isLoading.value = false
  }
})
</script>

<template>
  <main>
    <section class="profile body-container">
      <div class="container">
        <!-- Back button -->
        <button class="button is-small mb-4" @click="goBack">
          <span class="icon is-small">
            <i class="fas fa-arrow-left"></i>
          </span>
          <span>Back</span>
        </button>

        <h1 class="title is-1 has-text-black">User Profile</h1>

        <!-- Loading state -->
        <div v-if="isLoading" class="has-text-centered p-5">
          <span class="icon is-large">
            <i class="fas fa-spinner fa-pulse fa-2x"></i>
          </span>
          <p class="is-size-4 mt-2">Loading profile...</p>
        </div>

        <!-- Error state - Now includes both invalid ID errors and login requirement errors -->
        <div v-else-if="error" class="notification is-danger">
          <p><strong>Error:</strong> {{ error }}</p>
          <p v-if="error === 'You must be logged in to view user profiles'">
            Please log in to view user profiles.
          </p>
          <p v-else>Please try again or go back to search.</p>
        </div>

        <!-- Profile content -->
        <div v-else-if="user" class="columns is-multiline">
          <!-- User profile section -->
          <div class="column is-full-mobile is-one-third-desktop">
            <div class="card profile-card">
              <div class="card-content">
                <div class="has-text-centered mb-4">
                  <figure class="image is-128x128 mx-auto">
                    <img
                      :src="
                        user.pfp_image_url || 'https://bulma.io/images/placeholders/128x128.png'
                      "
                      alt="User profile picture"
                      class="is-rounded"
                    />
                  </figure>
                </div>

                <h2 class="title is-3 has-text-centered">{{ user.username }}</h2>
                <p class="subtitle is-5 has-text-centered">{{ user.email }}</p>

                <div class="user-info mt-4">
                  <div class="info-item">
                    <span class="icon"><i class="fas fa-id-badge"></i></span>
                    <span><strong>Role:</strong> {{ user.role }}</span>
                  </div>
                  <div v-if="user.gender" class="info-item">
                    <span class="icon"><i class="fas fa-venus-mars"></i></span>
                    <span><strong>Gender:</strong> {{ user.gender }}</span>
                  </div>
                  <div v-if="user.birth_date" class="info-item">
                    <span class="icon"><i class="fas fa-birthday-cake"></i></span>
                    <span><strong>Birth Date:</strong> {{ user.birth_date }}</span>
                  </div>
                  <div class="info-item">
                    <span class="icon"><i class="fas fa-file-alt"></i></span>
                    <span><strong>Posts:</strong> {{ userPosts.length }}</span>
                  </div>
                </div>

                <!-- Add Friend button if not current user and not already friend -->
                <div
                  v-if="isLoggedIn() && session.user && user.id !== session.user.id"
                  class="mt-5"
                >
                  <button
                    v-if="!isFriend"
                    class="button is-success is-fullwidth"
                    @click="sendFriendRequest"
                    :class="{ 'is-loading': isSendingRequest }"
                    :disabled="isSendingRequest"
                  >
                    <span class="icon">
                      <i class="fas fa-user-plus"></i>
                    </span>
                    <span>Add Friend</span>
                  </button>
                  <button v-else class="button is-static is-fullwidth">
                    <span class="icon">
                      <i class="fas fa-user-check"></i>
                    </span>
                    <span>Already Friends</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- User posts section -->
          <div class="column is-full-mobile is-two-thirds-desktop">
            <h3 class="title is-4 has-text-black">Recent Posts</h3>

            <div v-if="userPosts.length === 0" class="notification is-light">
              <p>This user hasn't created any posts yet.</p>
            </div>

            <div v-else class="posts-container">
              <div v-for="post in userPosts" :key="post.id" class="card post-card mb-4">
                <div class="card-content">
                  <h4 class="title is-5">{{ post.title }}</h4>
                  <p class="subtitle is-6">{{ post.post_message }}</p>

                  <div class="post-details">
                    <div class="tags">
                      <span class="tag is-info">{{ post.type_of_activity }}</span>
                      <span class="tag is-primary">{{ post.duration }}</span>
                      <span v-if="post.location" class="tag is-success">{{ post.location }}</span>
                    </div>

                    <p class="is-size-7 mt-2">
                      <span class="icon is-small"><i class="fas fa-calendar-alt"></i></span>
                      <span>Posted: {{ dayjs(post.created_on).fromNow() }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.profile-card {
  transition: transform 0.3s;
  height: 100%;
}

.profile-card:hover {
  transform: translateY(-5px);
}

.image.is-128x128 {
  margin-bottom: 1rem;
}

.image.is-128x128 img {
  object-fit: cover;
}

.user-info {
  margin-top: 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.info-item .icon {
  margin-right: 0.5rem;
  width: 24px;
}

.post-card {
  transition: transform 0.2s;
  border-left: 4px solid #3273dc;
  background-color: rgb(233, 75, 75);
  color: white;
}

.post-card:hover {
  transform: translateY(-2px);
}

.post-details {
  margin-top: 1rem;
  padding-top: 0.5rem;
  border-top: 1px solid #f0f0f0;
  color: white;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.mt-5 {
  margin-top: 2rem;
}
</style>
