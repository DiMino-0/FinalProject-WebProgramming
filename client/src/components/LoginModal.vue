<script setup lang="ts">
import { ref } from 'vue'

const showLoginPopUp = ref(false)
</script>

<template>
  <div class="navbar-item">
    <div
      class="button is-primary"
      v-bind:class="{ 'is-active': showLoginPopUp, 'is-clipped': showLoginPopUp }"
      @click="showLoginPopUp = !showLoginPopUp"
    >
      <strong>Login</strong>
    </div>
  </div>
  <div class="modal" v-bind:class="{ 'is-active': showLoginPopUp, 'is-clipped': showLoginPopUp }">
    <div class="modal-background" @click="showLoginPopUp = !showLoginPopUp"></div>
    <div class="modal-content">
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
        <div class="control">
          <button class="button is-primary">Login</button>
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

<style scoped></style>
