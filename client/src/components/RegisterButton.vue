<script setup lang="ts">
import { isLoggedIn } from '../models/session'
</script>
<!-- TODO Register a new user with db, NEED AUTH -->
<template>
  <div class="buttons" v-if="!isLoggedIn()">
    <div class="navbar-item has-dropdown is-hoverable">
      <a class="button is-dark">Register</a>
    </div>
  </div>
</template>

<style scoped></style>
