<script setup lang="ts">
import { ref } from 'vue'
import AddWorkoutModal from '@/components/AddWorkoutModal.vue'
import EntryContainer from '@/components/EntryContainer.vue'
import { refGetEntries, addEntry, deleteEntry, type ActivityEntry } from '@/models/ActivityEntry'

const entries = refGetEntries()
const showAddWorkoutModal = ref(false)

const handleAddEntry = (entry: ActivityEntry) => {
  addEntry(entry)
  showAddWorkoutModal.value = false
}

const handleDelete = (id: number) => {
  deleteEntry(id)
}
</script>

<template>
  <main>
    <section class="ActivityView body-container">
      <div class="container block">
        <h1 class="title is-1 has-text-black">My Activity Log</h1>
        <h2 class="subtitle workout-button">
          <button class="button is-primary" @click="showAddWorkoutModal = true">
            <span class="icon is-small">
              <i class="fas fa-plus"></i>
            </span>
            <span>Add Entry</span>
          </button>
        </h2>
      </div>

      <div class="ActivityEntries container">
        <EntryContainer
          v-for="entry in entries"
          :key="entry.id"
          :id="entry.id"
          :title="entry.title"
          :date="entry.date"
          :duration="entry.duration"
          :location="entry.location"
          :picture="entry.picture"
          :type="entry.type"
          @delete="handleDelete"
        />
      </div>
    </section>
    <AddWorkoutModal
      v-model="showAddWorkoutModal"
      @close="showAddWorkoutModal = false"
      @add-entry="handleAddEntry"
    />
  </main>
</template>

<style scoped>
.body-container {
  margin: 20px 20px 20px 20px;
  background-color: white;
}
.workout-button {
  margin-top: 20px;
}
</style>
