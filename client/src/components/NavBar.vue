<script setup lang="ts">
import { ref } from 'vue'
import LoginPopup from './LoginPopup.vue'
import RegisterPopup from './RegisterPopup.vue'

const showBurger = ref(false)
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

          <RouterLink to="/my-activity" class="navbar-item">My Activity</RouterLink>

          <RouterLink to="/friends-activity" class="navbar-item">Friends Activity</RouterLink>

          <RouterLink to="/statistics" class="navbar-item">Statistics</RouterLink>

          <RouterLink to="/search" class="navbar-item">Search</RouterLink>
        </div>
      </div>

      <div class="navbar-end">
        <LoginPopup />
        <RegisterPopup />
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
