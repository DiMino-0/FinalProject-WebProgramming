<script setup lang="ts">
// when navbar-burger is clicked, toggle the navbar-menu
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
  <nav class="navbar is-success" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="myNavBar"
        @click="toggleNavBar"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="myNavBar" class="navbar-menu">
      <div class="navbar-start">
        <RouterLink to="/" class="navbar-item">Home</RouterLink>

        <RouterLink to="/about" class="navbar-item">About</RouterLink>
      </div>

      <div class="navbar-end"></div>
    </div>
  </nav>
</template>

<style scoped></style>
