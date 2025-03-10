<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue', 'close'])

const closeModal = () => {
  emit('update:modelValue', false)
  emit('close')
}

const workoutTypes = ['Hiking', 'Swimming', 'Running', 'Cycling', 'Weight Training', 'Yoga']
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
            <input class="input" type="text" placeholder="Workout Name" />
          </div>
        </div>
        <div class="field">
          <label class="label">Date</label>
          <div class="control">
            <input class="input" type="text" placeholder="Workout Type" />
          </div>
        </div>
        <div class="field">
          <label class="label">Duration</label>
          <div class="control">
            <input class="input" type="text" placeholder="Workout Duration" />
          </div>
        </div>
        <div class="field">
          <label class="label">Location</label>
          <div class="control">
            <input class="input" type="text" placeholder="Workout Location" />
          </div>
        </div>
        <div class="field">
          <label class="label">Type</label>
          <div class="control">
            <div class="select is-fullwidth">
              <select>
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
            <input class="input" type="text" placeholder="Workout Picture" />
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button is-success">Add Workout</button>
          <button class="button" @click="closeModal">Cancel</button>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped></style>
