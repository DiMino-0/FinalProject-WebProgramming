<script setup lang="ts">
import { ref, computed } from 'vue'

// New entry form
const newEntry = ref({
  title: '',
  date: new Date().toISOString().split('T')[0],
  duration: '1 hour',
  location: '',
  picture: '/bike.png',
  type: 'Running',
})
</script>

<template>
  <main>
    <section class="activity body-container">
      <div class="container has-text-black">
        <div class="container">
          <h1 class="title is-1 has-text-black">The Activity Log</h1>
          <h2 class="subtitle has-text-black">
            <p>Manage your workout entries here!</p>
          </h2>
          <div class="notification is-warning login-required">
            Please log in to view and manage your activities.
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-content {
  flex-grow: 1;
}

.login-required {
  max-width: 800px;
}
</style>
