<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { isLoggedIn, refSession } from '@/models/session'
import { getAll as getAllFriends, type Friend } from '@/models/friend'
import { type User } from '@/models/users'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

// Initialize reactive references
const session = refSession()
const friendships = ref<Friend[]>([])
const isLoading = ref(false)

const myFriends = ref<User[]>([])

// Function to find friendship date for a specific friend
const getFriendshipDate = (friendId: string | number): string => {
  if (!session.value.user?.id) return ''

  const currentUserId = session.value.user.id
  const friendship = friendships.value.find(
    (f) =>
      (f.user_initiated_id === currentUserId && f.user_accepted_id === friendId) ||
      (f.user_initiated_id === friendId && f.user_accepted_id === currentUserId),
  )

  return friendship?.created_at ? dayjs(friendship.created_at).fromNow() : 'Unknown'
}

// Load friends when user is logged in
watchEffect(() => {
  if (isLoggedIn() && session.value.user?.id) {
    isLoading.value = true
    const currentUserId = session.value.user.id

    getAllFriends()
      .then((friendshipsResponse) => {
        friendships.value = friendshipsResponse.items

        // Filter friendships where current user is involved
        const myFriendships = friendships.value.filter(
          (friendship) =>
            friendship.user_initiated_id === currentUserId ||
            friendship.user_accepted_id === currentUserId,
        )

        // Create an array of friend user IDs
        const friendIds = myFriendships.map((friendship) =>
          friendship.user_initiated_id === currentUserId
            ? friendship.user_accepted_id
            : friendship.user_initiated_id,
        )

        // Clear existing friends and load them individually
        myFriends.value = []

        // Use Promise.all to fetch all friend users in parallel
        if (friendIds.length > 0) {
          const friendPromises = friendIds.map((friendId) =>
            import('@/models/users').then((module) => module.get(friendId)),
          )

          Promise.all(friendPromises)
            .then((friendUsers) => {
              myFriends.value = friendUsers
            })
            .catch((error) => {
              console.error('Error loading friend details:', error)
            })
            .finally(() => {
              isLoading.value = false
            })
        } else {
          isLoading.value = false
        }
      })
      .catch((error) => {
        console.error('Error loading friendships:', error)
        isLoading.value = false
      })
  } else {
    myFriends.value = []
  }
})
</script>

<template>
  <main>
    <section class="friends body-container">
      <div class="container has-text-black">
        <h1 class="title is-1 has-text-black">Friends' Posts</h1>
        <h2 class="subtitle has-text-black">
          <p>See what everyone else has been up to!</p>
        </h2>

        <div class="notification is-warning" v-if="!isLoggedIn()">
          Please log in to view your friends.
        </div>

        <div v-else>
          <!-- Loading indicator -->
          <div v-if="isLoading" class="has-text-centered p-5">
            <span class="icon is-large">
              <i class="fas fa-spinner fa-pulse fa-2x"></i>
            </span>
            <p class="is-size-4 mt-2">Loading friends...</p>
          </div>

          <!-- No friends message -->
          <div v-else-if="myFriends.length === 0" class="has-text-centered p-5">
            <span class="icon is-large">
              <i class="fas fa-user-friends fa-2x"></i>
            </span>
            <p class="is-size-4 mt-2">You don't have any friends yet.</p>
            <p class="is-size-6 mt-2">
              Visit the Search page to find users and add them as friends.
            </p>
          </div>

          <!-- Friends cards -->
          <div v-else class="columns is-multiline">
            <div v-for="friend in myFriends" :key="friend.id" class="column is-one-third">
              <div class="card friend-card">
                <div class="card-content">
                  <div class="media">
                    <div class="media-left">
                      <figure class="image is-48x48">
                        <img
                          :src="
                            friend.pfp_image_url || 'https://bulma.io/images/placeholders/96x96.png'
                          "
                          alt="Friend profile picture"
                          class="is-rounded"
                        />
                      </figure>
                    </div>
                    <div class="media-content">
                      <p class="title is-4 has-text-white">{{ friend.username }}</p>
                      <p class="subtitle is-6 has-text-white">{{ friend.email }}</p>
                    </div>
                  </div>
                  <div class="content has-text-white">
                    <p v-if="friend.gender"><strong>Gender:</strong> {{ friend.gender }}</p>
                    <p v-if="friend.posts">
                      <strong>Post Count:</strong> {{ friend.posts.length }}
                    </p>
                    <p class="is-size-7">
                      <time>Friends since: {{ getFriendshipDate(friend.id) }}</time>
                    </p>
                  </div>
                  <div class="buttons">
                    <button class="button is-small is-light">
                      <span class="icon"><i class="fas fa-eye"></i></span>
                      <span>View Posts</span>
                    </button>
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
.activity-timeline {
  max-width: 800px;
}

.activities-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.activity-card {
  border-left: 4px solid #3273dc;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.activity-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.tag {
  margin-right: 0.5rem;
}

.mr-1 {
  margin-right: 0.25rem;
}

/* Friend card styling to match post cards */
.friend-card {
  background-color: rgb(233, 75, 75);
  border: none;
  height: 100%;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.friend-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(10, 10, 10, 0.2);
}

.image.is-48x48 {
  overflow: hidden;
}

.image.is-48x48 img {
  object-fit: cover;
  width: 48px;
  height: 48px;
}

.buttons {
  margin-top: 1rem;
}
</style>
