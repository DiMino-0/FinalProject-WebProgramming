<script setup lang="ts">
import EntryContainer from '@/components/EntryContainer.vue'
import { refGetEntries } from '@/models/ActivityEntry'

const entries = refGetEntries()
</script>

<template>
  <main>
    <section class="activity body-container">
      <div class="container block">
        <h1 class="title is-1 has-text-black">My Activity Log</h1>
        <h2 class="subtitle">
          <button class="button is-primary">Add Workout</button>
        </h2>
      </div>

      <div class="activity container">
        <EntryContainer
          v-for="entry in entries"
          :key="entry.id"
          :title="entry.title"
          :date="entry.date"
          :duration="entry.duration"
          :location="entry.location"
          :picture="entry.picture"
          :type="entry.type"
        />
      </div>
    </section>
  </main>
</template>

<style scoped>
.body-container {
  margin: 20px 20px 20px 20px;
  background-color: white;
}
</style>
