<script setup lang="ts">
import { ref } from 'vue'
defineProps(['id', 'title', 'date', 'duration', 'location', 'type', 'picture'])
const emit = defineEmits(['delete'])

const showConfirm = ref(false)

const handleDelete = (id: number) => {
  showConfirm.value = true
}

const confirmDelete = (id: number) => {
  emit('delete', id)
  showConfirm.value = false
}
</script>

<template>
  <div class="box">
    <article class="media">
      <div class="media-left">
        <figure class="image is-64x64">
          <img :src="picture" alt="Placeholder image" />
        </figure>
      </div>

      <div class="media-content">
        <div class="content">
          <p>
            <strong>{{ title }}</strong> <small>{{ date }},</small> <small>{{ location }}</small>
            <br />
            Duration of workout: {{ duration }}
            <br />
            Type of workout: {{ type }}
          </p>
        </div>
      </div>

      <nav class="level is-mobile">
        <div class="level-left">
          <a class="level-item" aria-label="edit">
            <span class="icon is-small">
              <i class="fas fa-edit" aria-hidden="true"></i>
            </span>
          </a>
          <a class="level-item" aria-label="delete" @click="handleDelete(id)">
            <span class="icon is-small">
              <i class="fas fa-times" aria-hidden="true" style="color: red"></i>
            </span>
          </a>
        </div>
      </nav>
    </article>

    <!-- Confirmation Dialog -->
    <div v-if="showConfirm" class="notification is-danger">
      <button class="delete" @click="showConfirm = false"></button>
      <p class="mb-2">Are you sure you want to delete this workout?</p>
      <div class="buttons">
        <button class="button is-danger" @click="confirmDelete(id)">Delete</button>
        <button class="button" @click="showConfirm = false">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notification {
  margin-top: 1rem;
}
</style>
