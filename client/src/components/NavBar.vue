<script setup lang="ts">
defineEmits(['toggleNavBar'])
const toggleNavBar = () => {
  const burger = document.querySelector('.navbar-burger')
  const menu = document.querySelector('.navbar-menu')

  if (burger && menu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('is-active')
      menu.classList.toggle('is-active')
    })
  }
}
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbar-items"
        @click="toggleNavBar"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbar-items" class="navbar-menu">
      <div class="navbar-start">
        <RouterLink to="/" class="navbar-item">Home</RouterLink>

        <RouterLink to="/my-activity" class="navbar-item">My Activity</RouterLink>
      </div>

      <div class="navbar-end"></div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: rgb(85, 255, 119);
}
.navbar-item {
  color: black;
}

.navbar-item:hover {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
