<script setup lang="ts">
import { refGetOtherUsersEntries } from '@/models/ActivityEntry'
import { refGetCurrentUser } from '@/models/User'

// Get activities from all users except current user
const otherUsersActivities = refGetOtherUsersEntries()
const currentUser = refGetCurrentUser()

// Format date to be more readable
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <main>
    <section class="friends body-container">
      <div class="container has-text-black">
        <h1 class="title is-1 has-text-black">Friends' Activities</h1>
        <h2 class="subtitle has-text-black">
          <p>See what everyone else has been up to!</p>
        </h2>

        <div class="activity-timeline">
          <div v-if="currentUser == null" class="notification is-warning">
            Please log in to see others' activities.
          </div>

          <div v-else-if="otherUsersActivities.value.length === 0" class="notification is-info">
            No activities from other users to show yet.
          </div>

          <div v-else class="activities-container">
            <div
              v-for="activity in otherUsersActivities.value"
              :key="activity.id"
              class="activity-card box"
            >
              <div class="media">
                <div class="media-left">
                  <figure class="image is-48x48">
                    <img :src="activity.picture || '/bike.png'" alt="Activity icon" />
                  </figure>
                </div>
                <div class="media-content">
                  <p class="title is-5">{{ activity.title }}</p>
                  <p class="subtitle is-6">
                    <strong>{{ activity.username }}</strong> • {{ formatDate(activity.date) }}
                  </p>
                  <div class="content">
                    <span class="tag is-primary mr-1">{{ activity.type }}</span>
                    <span class="tag is-info mr-1">{{ activity.duration }}</span>
                    <span v-if="activity.location" class="tag is-success">{{
                      activity.location
                    }}</span>
                  </div>
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
.activity-timeline {
  max-width: 800px;
}

.activities-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.activity-card {
  border-left: 4px solid #3273dc;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.activity-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.tag {
  margin-right: 0.5rem;
}

.mr-1 {
  margin-right: 0.25rem;
}
</style>
