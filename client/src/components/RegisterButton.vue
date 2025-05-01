<script setup lang="ts">
import { apiCustomMethod, isLoggedIn } from '../models/session'
import { ref } from 'vue'

const isModalActive = ref(false)

// Form data
const form = ref({
  email: '',
  phone_number: '', // optional
  username: '',
  password: '',
  role: 'user',
})

// Toggle modal visibility
const toggleModal = () => {
  isModalActive.value = !isModalActive.value
}

// Handle form submission
const handleRegister = () => {
  // Validate form data
  if (!form.value.email || !form.value.username || !form.value.password) {
    alert('Please fill in all required fields.')
    return
  }

  // Call the API to register the user
  apiCustomMethod('users', 'POST', form.value)
    .then((response) => {
      // If we reach this block, registration was successful
      alert('Registration successful!')
      toggleModal()
      // Reset form data
      form.value = {
        email: '',
        phone_number: '',
        username: '',
        password: '',
        role: 'user',
      }
    })
    .catch((error) => {
      console.error('Error during registration:', error)
      alert('Registration failed. Please try again.')
    })
}

// Add defineOptions to set inheritAttrs to false, for a vue warning
defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <div class="buttons" v-if="!isLoggedIn()" v-bind="$attrs">
    <div class="navbar-item">
      <a class="button is-dark" @click="toggleModal">Register</a>
    </div>
  </div>

  <!-- Registration Modal -->
  <div class="modal" :class="{ 'is-active': isModalActive }">
    <div class="modal-background" @click="toggleModal"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Create an Account</p>
        <button class="delete" aria-label="close" @click="toggleModal"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Email</label>
          <div class="control">
            <input
              class="input"
              type="email"
              placeholder="Your email"
              v-model="form.email"
              required
            />
          </div>
        </div>

        <div class="field">
          <label class="label">Phone Number (Optional)</label>
          <div class="control">
            <input
              class="input"
              type="tel"
              placeholder="Your phone number"
              v-model="form.phone_number"
            />
          </div>
        </div>

        <div class="field">
          <label class="label">Username</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Choose a username"
              v-model="form.username"
              required
            />
          </div>
        </div>

        <div class="field">
          <label class="label">Password</label>
          <div class="control">
            <input
              class="input"
              type="password"
              placeholder="Choose a password"
              v-model="form.password"
              required
            />
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-primary" @click="handleRegister">Register</button>
        <button class="button" @click="toggleModal">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<style scoped></style>
