<script setup lang="ts">
import { ref } from 'vue'

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
          v-bind:class="{ 'is-active': showBurger.valueOf() }"
          v-on:click="showBurger = !showBurger.valueOf()"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div
        id="navbar-items"
        class="navbar-menu"
        v-bind:class="{ 'is-active': showBurger.valueOf() }"
      >
        <div class="navbar-start">
          <RouterLink to="/" class="navbar-item">Home</RouterLink>

          <RouterLink to="/my-activity" class="navbar-item">My Activity</RouterLink>

          <RouterLink to="/friends-activities" class="navbar-item">Friends Activity</RouterLink>

          <RouterLink to="/statistics" class="navbar-item">Statistics</RouterLink>

          <RouterLink to="/admin" class="navbar-item">Admin</RouterLink>
        </div>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <RouterLink to="/login" class="button is-primary">
            <strong>Login</strong>
          </RouterLink>
        </div>
        <div class="navbar-item">
          <RouterLink to="/register" class="button is-light"> Register </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
