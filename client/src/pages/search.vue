<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { search, type User } from '@/models/users'
import { OField, OAutocomplete } from '@oruga-ui/oruga-next'

const router = useRouter()

const newItemId = ref('')
const isLoading = ref(false)

// Handle navigation to user profile
const viewUserProfile = (userId: number) => {
  router.push(`/profile/${userId}`)
}

const options = ref<
  {
    value: User
    label: string
  }[]
>([])

async function getAsyncData(value: string) {
  const response = await search(value)
  options.value = response.items.map((item) => ({
    value: item,
    label: item.username,
  }))
}
</script>

<template>
  <main>
    <section class="search body-container">
      <div class="container block">
        <h1 class="title is-1 has-text-black">Search Users</h1>
        <div class="search-container">
          <o-field>
            <o-autocomplete
              v-model="newItemId"
              :options="options"
              backend-filtering
              :debounce="500"
              @input="getAsyncData"
              expanded
              placeholder="Select a product"
              icon="search"
              clearable
              open-on-focus
            >
              <template #empty>
                <div class="has-text-centered p-2">
                  <span>No results found</span>
                </div>
              </template>
            </o-autocomplete>
          </o-field>
        </div>

        <!-- Loading indicator -->
        <div v-if="isLoading" class="has-text-centered mt-4">
          <span class="icon is-large">
            <i class="fas fa-spinner fa-pulse fa-2x"></i>
          </span>
          <p class="is-size-5 mt-2">Searching...</p>
        </div>

        <!-- Search results -->
        <div v-else-if="1 == 1" class="search-results mt-4">
          <h2 class="title is-4 has-text-black">Users:</h2>
          <!-- <div class="columns is-multiline">
            <div v-for="user in users" :key="user.id" class="column is-one-third">
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
          <!-- <div class="buttons mt-3">
                      <button class="button is-link is-small" @click="viewUserProfile(user.id)">
                        <span class="icon is-small">
                          <i class="fas fa-user"></i>
                        </span>
                        <span>View Profile</span>
                      </button> -->

          <!-- Only show add friend button for users who aren't current user -->
          <!-- <button
                        v-if="session.user && user.id !== session.user.id"
                        class="button is-success is-small"
                      >
                        <span class="icon is-small">
                          <i class="fas fa-user-plus"></i>
                        </span>
                        <span>Add Friend</span>
                      </button> -->
        </div>
      </div>
      <!-- </div>
              </div>
            </div>
          </div>
        </div>
      </div> -->
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
