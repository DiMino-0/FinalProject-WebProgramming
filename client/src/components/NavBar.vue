<script setup lang="ts">
import { ref, computed } from 'vue'
import LoginPopup from './LoginModal.vue'
import RegisterPopup from './RegisterModal.vue'
import { refGetCurrentUser, setCurrentUser } from '@/models/User'

const showBurger = ref(false)
const currentUser = refGetCurrentUser()

const isLoggedIn = computed(() => {
  return currentUser.value !== null
})

const signOut = () => {
  setCurrentUser(null)
}
</script>

<template>
  <nav class="navbar is-success" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar-brand">
        <a
          role="button"
          class="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbar-items"
          v-bind:class="{ 'is-active': showBurger }"
          @click="showBurger = !showBurger"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbar-items" class="navbar-menu" v-bind:class="{ 'is-active': showBurger }">
        <div class="navbar-start">
          <RouterLink to="/" class="navbar-item">Home</RouterLink>

          <RouterLink to="/activity" class="navbar-item">Activity</RouterLink>

          <RouterLink to="/friends" class="navbar-item">Friends' Activity</RouterLink>

          <RouterLink to="/statistics" class="navbar-item">Statistics</RouterLink>

          <RouterLink to="/search" class="navbar-item">Search</RouterLink>

          <RouterLink to="/admin" class="navbar-item">Admin</RouterLink>
        </div>

        <div class="navbar-end">
          <div class="navbar-item" v-if="isLoggedIn">
            <span class="mr-2">Welcome, {{ currentUser?.username }}</span>
            <button class="button is-light" @click="signOut">Sign Out</button>
          </div>
          <template v-else>
            <LoginPopup />
            <RegisterPopup />
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
