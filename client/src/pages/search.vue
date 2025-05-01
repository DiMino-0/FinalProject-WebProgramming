<script setup lang="ts">
import { ref, watch } from 'vue'
import { getAll, type User } from '@/models/users'
import { api, refSession } from '@/models/session'
import { useRouter } from 'vue-router'

const searchTerm = ref('')
const searchResults = ref<User[]>([])
const isLoading = ref(false)
const hasSearched = ref(false)
const searchTimeout = ref<number | null>(null)
const router = useRouter()
const session = refSession()

// Function to search users
const searchUsers = async () => {
  if (!searchTerm.value.trim()) {
    searchResults.value = []
    hasSearched.value = false
    return
  }

  isLoading.value = true
  hasSearched.value = true

  try {
    // Call the search API endpoint
    const response = await api<{ items: User[]; total: number }>(`users/search/${searchTerm.value}`)
    searchResults.value = response.items
  } catch (error) {
    console.error('Error searching users:', error)
    searchResults.value = []
  } finally {
    isLoading.value = false
  }
}

// Debounce search input to avoid excessive API calls
watch(searchTerm, () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  searchTimeout.value = setTimeout(() => {
    searchUsers()
  }, 300) as unknown as number
})

// Load all users initially when no search is performed
const loadAllUsers = async () => {
  isLoading.value = true
  try {
    const response = await getAll()
    searchResults.value = response.items
  } catch (error) {
    console.error('Error loading users:', error)
  } finally {
    isLoading.value = false
  }
}

// Initialize with all users
loadAllUsers()

// Function to navigate to user profile
const viewUserProfile = (userId: number) => {
  router.push(`/profile/${userId}`)
}
</script>

<template>
  <main>
    <section class="search body-container">
      <div class="container block">
        <h1 class="title is-1 has-text-black">Search Users</h1>
        <div class="search-container">
          <div class="field">
            <div class="control has-icons-left">
              <input
                class="input is-medium"
                type="text"
                placeholder="Search by username or email"
                v-model="searchTerm"
              />
              <span class="icon is-left">
                <i class="fas fa-search"></i>
              </span>
            </div>
          </div>
        </div>

        <!-- Loading indicator -->
        <div v-if="isLoading" class="has-text-centered mt-4">
          <span class="icon is-large">
            <i class="fas fa-spinner fa-pulse fa-2x"></i>
          </span>
          <p class="is-size-5 mt-2">Searching...</p>
        </div>

        <!-- Search results -->
        <div v-else-if="searchResults.length > 0" class="search-results mt-4">
          <h2 class="title is-4 has-text-black">Results ({{ searchResults.length }})</h2>
          <div class="columns is-multiline">
            <div v-for="user in searchResults" :key="user.id" class="column is-one-third">
              <div class="card user-card">
                <div class="card-content">
                  <div class="media">
                    <div class="media-left">
                      <figure class="image is-48x48">
                        <img
                          :src="
                            user.pfp_image_url || 'https://bulma.io/images/placeholders/96x96.png'
                          "
                          alt="User profile picture"
                          class="is-rounded"
                        />
                      </figure>
                    </div>
                    <div class="media-content">
                      <p class="title is-5">{{ user.username }}</p>
                      <p class="subtitle is-6">{{ user.email }}</p>
                    </div>
                  </div>
                  <div class="content">
                    <p><strong>Role:</strong> {{ user.role }}</p>
                    <p v-if="user.gender"><strong>Gender:</strong> {{ user.gender }}</p>
                    <p class="has-text-white is-size-7">User ID: {{ user.id }}</p>

                    <!-- Add profile button -->
                    <div class="buttons mt-3">
                      <button class="button is-link is-small" @click="viewUserProfile(user.id)">
                        <span class="icon is-small">
                          <i class="fas fa-user"></i>
                        </span>
                        <span>View Profile</span>
                      </button>

                      <!-- Only show add friend button for users who aren't current user -->
                      <button
                        v-if="session.user && user.id !== session.user.id"
                        class="button is-success is-small"
                      >
                        <span class="icon is-small">
                          <i class="fas fa-user-plus"></i>
                        </span>
                        <span>Add Friend</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No results message -->
        <div v-else-if="hasSearched" class="has-text-centered mt-6">
          <span class="icon is-large">
            <i class="fas fa-search fa-2x"></i>
          </span>
          <p class="is-size-5 mt-2">No users found matching "{{ searchTerm }}"</p>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.search-container {
  max-width: 600px;
  margin: 0 auto 2rem;
}

.user-card {
  color: white;
  height: 100%;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  background-color: rgb(233, 75, 75);
}

.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(10, 10, 10, 0.1);
}

.image.is-48x48 {
  overflow: hidden;
}

.image.is-48x48 img {
  object-fit: cover;
  width: 48px;
  height: 48px;
}

.mt-3 {
  margin-top: 1rem;
}

.buttons {
  justify-content: flex-start;
}
</style>
