<script setup lang="ts">
import { computed, ref } from 'vue'
import { refGetCurrentUserEntries } from '@/models/ActivityEntry'
// Get activity entries for the current user
const userEntries = refGetCurrentUserEntries()

// Convert the activity entries to the format our calculations expect
const workouts = computed(() => {
  // Access the actual entries array properly
  const entries = userEntries.value?.value || []

  return entries.map((entry: { duration: string; type: string; date: string }) => {
    // Parse duration string to minutes
    const durationMin = ref(0)
    if (entry.duration.includes('hour')) {
      const hours = parseInt(entry.duration) || 0
      durationMin.value = hours * 60
    } else {
      durationMin.value = parseInt(entry.duration) || 0
    }

    // Estimate distance based on activity type and duration
    const avgSpeedKmPerHour =
      entry.type === 'Running' ? 8 : entry.type === 'Swimming' ? 2 : entry.type === 'Hiking' ? 5 : 4
    const distance = (durationMin.value / 60) * avgSpeedKmPerHour

    return {
      date: entry.date,
      duration: durationMin.value,
      distance: distance,
    }
  })
})

const today = computed(() => {
  const todayDate = new Date().toISOString().split('T')[0]
  const todayWorkouts = workouts.value.filter(
    (w: { date: string; duration: number; distance: number }) => w.date === todayDate,
  )
  return calculateStats(todayWorkouts)
})

const thisWeek = computed(() => {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const weekWorkouts = workouts.value.filter(
    (w: { date: string; duration: number; distance: number }) => new Date(w.date) >= weekAgo,
  )
  return calculateStats(weekWorkouts)
})

const allTime = computed(() => {
  return calculateStats(workouts.value)
})

function calculateStats(workouts: any[]) {
  const totalDistance = workouts.reduce((sum, w) => sum + w.distance, 0)
  const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0)
  const avgPace = totalDistance > 0 ? totalDuration / totalDistance : 0

  return {
    distance: totalDistance.toFixed(1),
    duration: totalDuration,
    pace: avgPace.toFixed(2),
  }
}
</script>

<template>
  <main>
    <section class="statistics body-container">
      <div class="container has-text-black">
        <h1 class="title is-1 has-text-black">Statistics</h1>

        <div class="columns">
          <div class="column">
            <div class="card">
              <div class="card-content">
                <p class="title is-4">Today</p>
                <div class="content">
                  <p>Total Distance: {{ today.distance }} km</p>
                  <p>Total Duration: {{ today.duration }} min</p>
                  <p>Average Pace: {{ today.pace }} min/km</p>
                </div>
              </div>
            </div>
          </div>

          <div class="column">
            <div class="card">
              <div class="card-content">
                <p class="title is-4">This Week</p>
                <div class="content">
                  <p>Total Distance: {{ thisWeek.distance }} km</p>
                  <p>Total Duration: {{ thisWeek.duration }} min</p>
                  <p>Average Pace: {{ thisWeek.pace }} min/km</p>
                </div>
              </div>
            </div>
          </div>

          <div class="column">
            <div class="card">
              <div class="card-content">
                <p class="title is-4">All Time</p>
                <div class="content">
                  <p>Total Distance: {{ allTime.distance }} km</p>
                  <p>Total Duration: {{ allTime.duration }} min</p>
                  <p>Average Pace: {{ allTime.pace }} min/km</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.card {
  height: 100%;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}

.card-content {
  padding: 1.5rem;
}
</style>
