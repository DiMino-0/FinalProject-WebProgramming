<script setup lang="ts">
import { ref } from 'vue'
import type { ActivityEntry } from '@/models/ActivityEntry'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue', 'close', 'add-entry'])

const closeModal = () => {
  emit('update:modelValue', false)
  emit('close')
}

const workoutTypes = ['Hiking', 'Swimming', 'Running', 'Cycling', 'Weight Training', 'Yoga']

const form = ref({
  title: '',
  date: new Date().toISOString().split('T')[0],
  duration: '',
  location: '',
  type: '',
  picture: '/bike.png', // Default picture for now
})

const submit = () => {
  const newEntry: ActivityEntry = {
    id: Math.random(), // Simple random ID for now
    ...form.value,
  }
  emit('add-entry', newEntry)
  closeModal()
  // Reset form
  form.value = {
    title: '',
    date: new Date().toISOString().split('T')[0],
    duration: '',
    location: '',
    type: '',
    picture: '/bike.png',
  }
}
</script>

<template>
  <div class="modal" :class="{ 'is-active': modelValue }">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Add Workout</p>
        <button class="delete" aria-label="close" @click="closeModal"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Title</label>
          <div class="control">
            <input v-model="form.title" class="input" type="text" placeholder="Workout Name" />
          </div>
        </div>
        <div class="field">
          <label class="label">Date</label>
          <div class="control">
            <input
              v-model="form.date"
              class="input"
              type="date"
              :min="new Date().toISOString().split('T')[0]"
              :max="
                new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                  .toISOString()
                  .split('T')[0]
              "
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Duration</label>
          <div class="control">
            <input
              v-model="form.duration"
              class="input"
              type="text"
              placeholder="Workout Duration"
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Location</label>
          <div class="control">
            <input
              v-model="form.location"
              class="input"
              type="text"
              placeholder="Workout Location"
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Type</label>
          <div class="control">
            <div class="select is-fullwidth">
              <select v-model="form.type">
                <option value="">Select workout type</option>
                <option v-for="type in workoutTypes" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="field">
          <label class="label">Picture</label>
          <div class="control">
            <input v-model="form.picture" class="input" type="text" placeholder="Workout Picture" />
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button is-success" @click="submit">Add Workout</button>
          <button class="button" @click="closeModal">Cancel</button>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped></style>
