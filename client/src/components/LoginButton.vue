<script setup lang="ts">
import { refSession, login, logout, isLoggedIn } from '../models/session'
import { ref } from 'vue'
import { getAll, type User } from '../models/users'

const users = ref<User[]>([])
const session = refSession()

getAll().then((response) => {
  users.value = response.items
})
</script>

<template>
  <div class="buttons" v-if="!isLoggedIn()">
    <div class="navbar-item has-dropdown is-hoverable">
      <a class="button is-light"> Log in </a>

      <div class="navbar-dropdown">
        <a class="navbar-item" v-for="user in users" :key="user.id" @click="login(user.id)">
          {{ user.username }} {{ user.email }}
        </a>
      </div>
    </div>
  </div>
  <div class="profile" v-else>
    <img :src="session?.user?.pfp_image_url" alt="user avatar" />
    <div>
      {{ session.user?.username }} {{ session.user?.email }} (<a @click="logout()">Log out</a>)
      <br />
    </div>
  </div>
</template>

<style scoped>
.navbar-dropdown {
  max-height: calc(100vh - 3.5rem);
  overflow-y: auto;
}

.profile {
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-size: small;
}
</style>
