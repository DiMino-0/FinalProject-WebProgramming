<script setup lang="ts">
import { ref } from 'vue'
import LoginButton from './LoginButton.vue'
import RegisterButton from './RegisterButton.vue'

const showBurger = ref(false)
</script>

<template>
  <nav class="navbar is-success" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar-brand">
        <a class="navbar-item" href="">
          <img alt="Logo Ipsum logo" class="logo" src="@/assets/logoipsum.svg" width="30" />
        </a>

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

          <RouterLink to="/posts" class="navbar-item">Posts</RouterLink>

          <RouterLink to="/friends" class="navbar-item">Friends' Activity</RouterLink>

          <RouterLink to="/statistics" class="navbar-item">Statistics</RouterLink>

          <RouterLink to="/search" class="navbar-item">Search</RouterLink>

          <RouterLink to="/admin" class="navbar-item">Admin</RouterLink>
        </div>

        <div class="navbar-end">
          <LoginButton class="navbar-item" />
          <RegisterButton class="navbar-item" />
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar-burger span {
  background-color: black;
  height: 2px;
}
.navbar {
  background-color: #32ae9b;
}

.navbar-end {
  padding-top: 1rem;
  margin-bottom: -1rem;
}

/* Isolate login and register components from Bulma's cascade */
:deep(.navbar-item.login-button),
:deep(.navbar-item.register-button) {
  isolation: isolate;
}

/* Override Bulma's default behavior for has-dropdown inside is-active */
:deep(.navbar-dropdown) {
  display: none;
}

:deep(.has-dropdown.is-hoverable:hover .navbar-dropdown) {
  display: block;
  left: 0;
  top: 100%;
  margin-top: -0.4rem;
}
</style>
