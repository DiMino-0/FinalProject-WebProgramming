<script setup lang="ts">
import { ref, computed } from 'vue'
import { refGetCurrentUserEntries, addEntry, deleteEntry } from '@/models/ActivityEntry'
import { refGetCurrentUser } from '@/models/User'

const currentUser = refGetCurrentUser()
const entries = refGetCurrentUserEntries()

// New entry form
const newEntry = ref({
  title: '',
  date: new Date().toISOString().split('T')[0],
  duration: '1 hour',
  location: '',
  picture: '/bike.png',
  type: 'Running',
})

// Activity types for dropdown
const activityTypes = ['Running', 'Swimming', 'Cycling', 'Hiking', 'Walking', 'Gym', 'Other']

// Submit new entry
const submitEntry = () => {
  if (newEntry.value.title && newEntry.value.date && newEntry.value.duration) {
    addEntry(newEntry.value)
    // Reset form
    newEntry.value = {
      title: '',
      date: new Date().toISOString().split('T')[0],
      duration: '',
      location: '',
      picture: '/bike.png',
      type: '',
    }
  }
}

// Delete an entry
const removeEntry = (id: number) => {
  deleteEntry(id)
}

// Check if user is logged in
const isLoggedIn = computed(() => !!currentUser.value)
</script>

<template>
  <main>
    <section class="activity body-container">
      <div class="container has-text-black">
        <h1 class="title is-1 has-text-black">Your Activity Log</h1>
        <h2 class="subtitle has-text-black">
          <p>Manage your entries!</p>
        </h2>

        <div class="container">
          <div v-if="currentUser == null" class="notification is-warning login-required">
            Please log in to view and manage your activities.
          </div>
          <div v-else-if="isLoggedIn">
            <h1 class="title is-1 has-text-black">
              Welcome to your Activity Log, {{ currentUser?.username }}
            </h1>
            <h2 class="subtitle is-4 mt-2 has-text-black"></h2>

            <div class="box">
              <h3 class="title is-4">Add New Activity</h3>
              <div class="field">
                <label class="label">Title</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    v-model="newEntry.title"
                    placeholder="Activity title"
                  />
                </div>
              </div>

              <div class="columns">
                <div class="column">
                  <div class="field">
                    <label class="label">Date</label>
                    <div class="control">
                      <input class="input" type="date" v-model="newEntry.date" />
                    </div>
                  </div>
                </div>

                <div class="column">
                  <div class="field">
                    <label class="label">Duration</label>
                    <div class="control">
                      <input
                        class="input"
                        type="text"
                        v-model="newEntry.duration"
                        placeholder="e.g. 30 minutes"
                      />
                    </div>
                  </div>
                </div>

                <div class="column">
                  <div class="field">
                    <label class="label">Type</label>
                    <div class="control">
                      <div class="select is-fullwidth">
                        <select v-model="newEntry.type">
                          <option v-for="type in activityTypes" :key="type" :value="type">
                            {{ type }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="field">
                <label class="label">Location (optional)</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    v-model="newEntry.location"
                    placeholder="Where did you do this activity?"
                  />
                </div>
              </div>

              <div class="field">
                <div class="control">
                  <button class="button is-primary" @click="submitEntry">Add Activity</button>
                </div>
              </div>
            </div>

            <!-- Display entries -->
            <div class="mt-4">
              <h3 class="title is-2 has-text-black">Your Activities</h3>

              <div v-if="entries.value.length === 0" class="notification is-info">
                You haven't logged any activities yet. Add your first one above!
              </div>

              <div class="columns is-multiline">
                <div v-for="entry in entries.value" :key="entry.id" class="column is-4">
                  <div class="card">
                    <div class="card-header">
                      <p class="card-header-title">{{ entry.title }}</p>
                    </div>
                    <div class="card-content">
                      <div class="content">
                        <p><strong>Date:</strong> {{ entry.date }}</p>
                        <p><strong>Duration:</strong> {{ entry.duration }}</p>
                        <p><strong>Type:</strong> {{ entry.type }}</p>
                        <p v-if="entry.location"><strong>Location:</strong> {{ entry.location }}</p>
                      </div>
                    </div>
                    <footer class="card-footer">
                      <a href="#" class="card-footer-item" @click="removeEntry(entry.id)">Delete</a>
                    </footer>
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
