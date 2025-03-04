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
  background-color: white;
  margin: 1rem;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(193, 19, 19, 1);
}
</style>
