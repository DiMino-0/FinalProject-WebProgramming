<script setup lang="ts">
import { refGetCurrentUser } from '@/models/User'

const userRole = refGetCurrentUser().value?.role
</script>

<template>
  <main>
    <div class="admin body-container" v-if="userRole === 'admin'">
      <h1 class="title is-1 has-text-black">
        Here you can manage users, if you have the correct role
      </h1>
    </div>
    <div class="body-container" v-else>
      <h1 class="title is-1 has-text-black">You are not authorized to view this page</h1>
    </div>
  </main>
</template>

<style scoped></style>
