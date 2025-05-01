<script setup lang="ts">
import { refSession, login, logout, isLoggedIn } from '../models/session'
import { ref } from 'vue'
import { getAll, type User } from '../models/users'
import { useRouter } from 'vue-router'

// Add defineOptions to set inheritAttrs to false
defineOptions({
  inheritAttrs: false,
})

const users = ref<User[]>([])
const session = refSession()

getAll().then((response) => {
  users.value = response.items
})

// Add a router instance
const router = useRouter()

// Function to navigate to profile page
function navigateToProfile() {
  router.push(`/profile/${session.value?.user?.id}`)
}
</script>

<template>
  <div class="buttons" v-if="!isLoggedIn()" v-bind="$attrs">
    <div class="navbar-item has-dropdown is-hoverable">
      <a class="button is-light"> Log in </a>

      <div class="navbar-dropdown dropdown">
        <a
          class="navbar-item user-item"
          v-for="user in users"
          :key="user.id"
          @click="login(user.id)"
        >
          <figure class="image is-24x24 mr-2">
            <img
              class="is-rounded"
              :src="user.pfp_image_url || 'https://bulma.io/images/placeholders/24x24.png'"
              :alt="`${user.username}'s profile`"
            />
          </figure>
          <span>{{ user.username }} {{ user.email }}</span>
        </a>
      </div>
    </div>
  </div>
  <div class="profile" v-else v-bind="$attrs">
    <img :src="session?.user?.pfp_image_url" alt="user avatar" />
    <div>
      {{ session.user?.username }} {{ session.user?.email }} (<a @click="logout()">Log out</a>)
      <br />
    </div>
    <button class="button is-small is-info mt-1" @click="navigateToProfile">Profile</button>
  </div>
</template>

<style scoped>
.navbar-dropdown {
  max-height: calc(100vh - 3.5rem);
  overflow-y: auto;
}

/* Add these rules to properly position the dropdown */
.navbar-item.has-dropdown.is-hoverable {
  position: relative;
}

.navbar-item.has-dropdown.is-hoverable .navbar-dropdown {
  margin-top: 0.05rem !important;
  top: 100% !important;
}

.profile {
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-size: small;
  padding-bottom: 2rem;
}

.user-item {
  display: flex;
  align-items: center;
}

.image.is-24x24 {
  min-width: 24px;
}

.image.is-24x24 img {
  height: 24px;
  width: 24px;
  object-fit: cover;
}
</style>
