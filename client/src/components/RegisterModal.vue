<script setup lang="ts">
import { ref } from 'vue'

const showRegisterPopUp = ref(false)
</script>

<!--TODO: Register a new user when the form is submitted-->
<template>
  <div class="navbar-item">
    <div
      class="button is-warning"
      v-bind:class="{ 'is-active': showRegisterPopUp, 'is-clipped': showRegisterPopUp }"
      @click="showRegisterPopUp = !showRegisterPopUp"
    >
      <strong>Register</strong>
    </div>
  </div>
  <div
    class="modal"
    v-bind:class="{ 'is-active': showRegisterPopUp, 'is-clipped': showRegisterPopUp }"
  >
    <div class="modal-background" @click="showRegisterPopUp = !showRegisterPopUp"></div>
    <div class="modal-content">
      <div class="field">
        <label class="label">Username</label>
        <div class="control">
          <input class="input" type="text" placeholder="Username" />
        </div>
      </div>
      <div class="field">
        <label class="label">Email</label>
        <div class="control">
          <input class="input" type="email" placeholder="Email" />
        </div>
      </div>
      <div class="field">
        <label class="label">Password</label>
        <div class="control">
          <input class="input" type="password" placeholder="Password" />
        </div>
      </div>
      <div class="field">
        <label class="label">Confirm Password</label>
        <div class="control">
          <input class="input" type="password" placeholder="Confirm Password" />
        </div>
      </div>
      <div class="field">
        <div class="control">
          <button class="button is-primary">Register</button>
        </div>
      </div>
    </div>
    <button
      class="modal-close is-large"
      aria-label="close"
      @click="showRegisterPopUp = !showRegisterPopUp"
    ></button>
  </div>
</template>

<style scoped></style>
