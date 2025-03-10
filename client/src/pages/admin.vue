<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { requireAdmin } from '@/models/auth'

const canAccess = ref(false)

onMounted(() => {
  canAccess.value = requireAdmin()
})
</script>

<template>
  <main>
    <div class="admin body-container" v-if="canAccess">
      <h1 class="title is-1 has-text-black">Admin Panel</h1>
      // ... admin content here ...
    </div>
    <div class="body-container" v-else>
      <h1 class="title is-1 has-text-black">Access Denied</h1>
      <p class="subtitle">You must be an admin to view this page.</p>
    </div>
  </main>
</template>

<style scoped></style>
