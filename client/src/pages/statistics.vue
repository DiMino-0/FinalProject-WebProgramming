<script setup lang="ts">
import { computed, ref } from 'vue'

const today = computed(() => {
  const todayDate = new Date().toISOString().split('T')[0]
})

const thisWeek = computed(() => {
  const weekAgo = new Date()
})

const allTime = computed(() => {})

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
                  <p>Total Distance: {{ today }} km</p>
                  <p>Total Duration: {{ today }} min</p>
                  <p>Average Pace: {{ today }} min/km</p>
                </div>
              </div>
            </div>
          </div>

          <div class="column">
            <div class="card">
              <div class="card-content">
                <p class="title is-4">This Week</p>
                <div class="content">
                  <p>Total Distance: {{ thisWeek }} km</p>
                  <p>Total Duration: {{ thisWeek }} min</p>
                  <p>Average Pace: {{ thisWeek }} min/km</p>
                </div>
              </div>
            </div>
          </div>

          <div class="column">
            <div class="card">
              <div class="card-content">
                <p class="title is-4">All Time</p>
                <div class="content">
                  <p>Total Distance: {{ allTime }} km</p>
                  <p>Total Duration: {{ allTime }} min</p>
                  <p>Average Pace: {{ allTime }} min/km</p>
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
