<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <header>
    <NavBar />
  </header>

  <div class="body-container">
    <RouterView />
  </div>
</template>

<style scoped>
.body-container {
  margin-top: 20px;
  background-color: white;
}
</style>
