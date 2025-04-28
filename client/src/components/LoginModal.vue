<script setup lang="ts">
import { ref } from 'vue'

const showLoginPopUp = ref(false)
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

        <div class="is-divider" data-content="OR"></div>

        <div class="field">
          <label class="label">Login as Existing User</label>
          <div class="control">
            <div class="select is-fullwidth"></div>
          </div>
        </div>

        <div class="field">
          <div class="control">
            <button class="button is-info is-fullwidth" @click="">Login as {{}}</button>
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
