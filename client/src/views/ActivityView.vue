<script setup lang="ts">
import { ref } from 'vue'
import ActivityEntry from '@/components/ActivityEntry.vue'

const posts = ref([
  {
    id: 1,
    title: 'Climbing Everest',
    date: '2021-10-10',
    duration: '2 hours',
    location: 'Mount Everest',
    picture: 'https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3b',
    type: 'Hiking',
  },
  {
    id: 2,
    title: 'Crossing the Ocean!',
    date: '2021-10-11',
    duration: '1 hour',
    location: 'Pacific Ocean',
    picture: 'https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3b',
    type: 'Swimming',
  },
  {
    id: 3,
    title: 'Running in the park -_-',
    date: '2021-10-12',
    duration: '1 hour',
    location: 'Central Park',
    picture: 'https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3b',
    type: 'Running',
  },
])
</script>

<template>
  <main>
    <section class="ActivityView body-container">
      <div class="container block">
        <h1 class="title is-1">My Activity Log</h1>
        <subtitle>
          <button class="button is-primary">Add Workout</button>
        </subtitle>
      </div>

      <div class="ActivityEntries container">
        <ActivityEntry
          v-for="post in posts"
          :key="post.id"
          :title="post.title"
          :date="post.date"
          :duration="post.duration"
          :location="post.location"
          :picture="post.picture"
          :type="post.type"
        />
      </div>
    </section>
  </main>
</template>

<style scoped>
.title {
  color: black;
}
.body-container {
  margin: 20px 20px 20px 20px;
  background-color: white;
}
</style>
