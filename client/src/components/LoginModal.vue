<script setup lang="ts">
import { ref } from 'vue'
import { refUsers, setCurrentUser } from '@/models/User'
import { initializeUserEntries } from '@/models/ActivityEntry'

// Use the actual list of users from User.ts
const users = refUsers()

const showLoginPopUp = ref(false)
const email = ref('')
const password = ref('')
const selectedUser = ref<any>(null)

const selectUser = (user: any) => {
  if (user) {
    email.value = user.email
    password.value = user.password
    selectedUser.value = user
  }
}

const login = () => {
  if (selectedUser.value) {
    // Set the current user in the system
    setCurrentUser(selectedUser.value)
    // Initialize entries if this is the first login
    initializeUserEntries(selectedUser.value.uid)
    console.log('Logged in as:', selectedUser.value.username)
  } else {
    // Find user by email/password
    const user = users.value.find((u) => u.email === email.value && u.password === password.value)
    if (user) {
      setCurrentUser(user)
      // Initialize entries if this is the first login
      initializeUserEntries(user.uid)
      console.log('Logged in as:', user.username)
    } else {
      console.log('Invalid credentials')
      // Here you could show an error message
    }
  }
  showLoginPopUp.value = false
}
</script>

<template>
  <div class="navbar-item">
    <div
      class="button is-info"
      v-bind:class="{ 'is-active': showLoginPopUp, 'is-clipped': showLoginPopUp }"
      @click="showLoginPopUp = !showLoginPopUp"
    >
      <strong>Login</strong>
    </div>
  </div>
  <div class="modal" v-bind:class="{ 'is-active': showLoginPopUp, 'is-clipped': showLoginPopUp }">
    <div class="modal-background" @click="showLoginPopUp = !showLoginPopUp"></div>
    <div class="modal-content">
      <div class="box">
        <div class="field">
          <label class="label">Email</label>
          <div class="control">
            <input class="input" type="email" placeholder="Email" v-model="email" />
          </div>
        </div>
        <div class="field">
          <label class="label">Password</label>
          <div class="control">
            <input class="input" type="password" placeholder="Password" v-model="password" />
          </div>
        </div>
        <div class="field">
          <div class="control">
            <button class="button is-primary" @click="login">Login</button>
          </div>
        </div>

        <div class="is-divider" data-content="OR"></div>

        <div class="field">
          <label class="label">Login as Existing User</label>
          <div class="control">
            <div class="select is-fullwidth">
              <select v-model="selectedUser" @change="selectUser(selectedUser)">
                <option :value="null">Select a user</option>
                <option v-for="user in users" :key="user.uid" :value="user">
                  {{ user.username }} ({{ user.email }}) - {{ user.role }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="field" v-if="selectedUser">
          <div class="control">
            <button class="button is-info is-fullwidth" @click="login">
              Login as {{ selectedUser.username }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <button
      class="modal-close is-large"
      aria-label="close"
      @click="showLoginPopUp = !showLoginPopUp"
    ></button>
  </div>
</template>

<style scoped>
.is-divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1rem 0;
}

.is-divider::before,
.is-divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #dbdbdb;
}

.is-divider::before {
  margin-right: 0.5em;
}

.is-divider::after {
  margin-left: 0.5em;
}
</style>
