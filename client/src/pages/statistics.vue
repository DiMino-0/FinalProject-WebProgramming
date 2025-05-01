<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { isLoggedIn, refSession } from '@/models/session'
import { getAll as getAllPosts, type Post } from '@/models/post'
import { activityTypes } from '@/models/activityTypes'
import dayjs from 'dayjs'

const session = refSession()
const posts = ref<Post[]>([])
const isLoading = ref(false)
const stats = ref({
  today: { activities: 0, duration: 0, types: {} as Record<string, number> },
  thisWeek: { activities: 0, duration: 0, types: {} as Record<string, number> },
  allTime: { activities: 0, duration: 0, types: {} as Record<string, number> },
})

function extractMinutes(duration: string): number {
  const match = duration?.match(/(\d+)\s*minutes?/i)
  if (match && match[1]) {
    return parseInt(match[1], 10)
  }

  // Handle "1 hour" format
  const hourMatch = duration?.match(/(\d+)\s*hours?/i)
  if (hourMatch && hourMatch[1]) {
    return parseInt(hourMatch[1], 10) * 60
  }

  return 0
}

const todayPosts = computed(() => {
  const today = dayjs().format('YYYY-MM-DD')
  return posts.value.filter((post) => {
    const postDate = dayjs(post.date).format('YYYY-MM-DD')
    return postDate === today
  })
})

const thisWeekPosts = computed(() => {
  const oneWeekAgo = dayjs().subtract(7, 'day')
  return posts.value.filter((post) => {
    const postDate = dayjs(post.date)
    return postDate.isAfter(oneWeekAgo)
  })
})

const allTimePosts = computed(() => {
  return posts.value
})

function calculateStatsForPosts(postsList: Post[]) {
  const types: Record<string, number> = {}

  // Initialize all activity types with zero count
  activityTypes.forEach((type) => {
    types[type.id] = 0
  })

  let totalDuration = 0

  postsList.forEach((post) => {
    // Normalize activity type to match the centralized types
    const activityType = post.type_of_activity.toLowerCase()

    types[activityType] = (types[activityType] || 0) + 1
    totalDuration += extractMinutes(post.duration)
  })

  return {
    activities: postsList.length,
    duration: totalDuration,
    types,
  }
}

// watchEffect to react to session changes
watchEffect(() => {
  if (isLoggedIn()) {
    isLoading.value = true

    getAllPosts()
      .then((response) => {
        // Filter posts for current user
        if (session.value.user) {
          posts.value = response.items.filter((post) => post.user_id === session.value.user?.id)

          // Calculate stats
          stats.value = {
            today: calculateStatsForPosts(todayPosts.value),
            thisWeek: calculateStatsForPosts(thisWeekPosts.value),
            allTime: calculateStatsForPosts(allTimePosts.value),
          }
        }
      })
      .catch((error) => {
        console.error('Failed to fetch posts:', error)
      })
      .finally(() => {
        isLoading.value = false
      })
  }
})

// Format duration as hours and minutes
function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`
  }
  return `${remainingMinutes}m`
}

// Computed properties for active activity types
const todayActiveTypes = computed(() => {
  return activityTypes.filter((type) => stats.value.today.types[type.id] > 0)
})

const thisWeekActiveTypes = computed(() => {
  return activityTypes.filter((type) => stats.value.thisWeek.types[type.id] > 0)
})
</script>

<template>
  <main>
    <section class="statistics body-container">
      <div class="container has-text-black">
        <h1 class="title is-1 has-text-black">Statistics</h1>

        <div class="notification is-warning" v-if="!isLoggedIn()">
          Please log in to view your activity statistics.
        </div>

        <div v-else-if="isLoading" class="has-text-centered my-5">
          <span class="icon is-large">
            <i class="fas fa-spinner fa-pulse fa-2x"></i>
          </span>
          <p class="is-size-5 mt-2">Loading statistics...</p>
        </div>

        <div v-else class="columns">
          <div class="column">
            <div class="card">
              <div class="card-content">
                <p class="title is-4">Today</p>
                <div class="content">
                  <p><strong>Activities:</strong> {{ stats.today.activities }}</p>
                  <p><strong>Total Duration:</strong> {{ formatDuration(stats.today.duration) }}</p>
                  <div v-if="stats.today.activities > 0">
                    <p><strong>Activity Types:</strong></p>
                    <div class="activity-types-container">
                      <div
                        v-for="type in todayActiveTypes"
                        :key="type.id"
                        class="activity-type has-activity"
                      >
                        <span class="tag" :class="type.color">{{ type.label }}</span>
                        {{ stats.today.types[type.id] }}
                      </div>
                    </div>
                  </div>
                  <p v-else class="has-text-grey">No activities recorded today</p>
                </div>
              </div>
            </div>
          </div>

          <div class="column">
            <div class="card">
              <div class="card-content">
                <p class="title is-4">This Week</p>
                <div class="content">
                  <p><strong>Activities:</strong> {{ stats.thisWeek.activities }}</p>
                  <p>
                    <strong>Total Duration:</strong> {{ formatDuration(stats.thisWeek.duration) }}
                  </p>
                  <div v-if="stats.thisWeek.activities > 0">
                    <p><strong>Activity Types:</strong></p>
                    <div class="activity-types-container">
                      <div
                        v-for="type in thisWeekActiveTypes"
                        :key="type.id"
                        class="activity-type has-activity"
                      >
                        <span class="tag" :class="type.color">{{ type.label }}</span>
                        {{ stats.thisWeek.types[type.id] }}
                      </div>
                    </div>
                  </div>
                  <p v-else class="has-text-grey">No activities recorded this week</p>
                </div>
              </div>
            </div>
          </div>

          <div class="column">
            <div class="card">
              <div class="card-content">
                <p class="title is-4">All Time</p>
                <div class="content">
                  <p><strong>Activities:</strong> {{ stats.allTime.activities }}</p>
                  <p>
                    <strong>Total Duration:</strong> {{ formatDuration(stats.allTime.duration) }}
                  </p>
                  <div v-if="stats.allTime.activities > 0">
                    <p><strong>Activity Types:</strong></p>
                    <div class="activity-types-container">
                      <div
                        v-for="type in activityTypes"
                        :key="type.id"
                        class="activity-type"
                        :class="{ 'has-activity': stats.allTime.types[type.id] > 0 }"
                      >
                        <span class="tag" :class="type.color">{{ type.label }}</span>
                        {{ stats.allTime.types[type.id] || 0 }}
                      </div>
                    </div>
                  </div>
                  <p v-else class="has-text-grey">No activities recorded yet</p>
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

.activity-types-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.5rem;
}

.activity-type {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.activity-type.has-activity {
  opacity: 1;
  font-weight: bold;
}

.tag {
  margin-right: 0.3rem;
}
</style>
