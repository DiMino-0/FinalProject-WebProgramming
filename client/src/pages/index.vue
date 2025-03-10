<script setup lang="ts"></script>

<template>
  <main class="index">
    <section class="index body-container">
      <div class="container has-text-black block">
        <h1 class="title is-1 has-text-black">Welcome to the Fitness Tracker</h1>
        <h2 class="subtitle has-text-black">
          <p>
            You can use this app to track your fitness activities and share them with your friends.
          </p>
        </h2>
      </div>

      <section class="container block">
        <!-- show off features flashily -->
        <div class="columns">
          <div class="column">
            <div class="card">
              <div class="card-content">
                <p class="title">Track Your Activities</p>
                <p class="subtitle">
                  <span class="icon is-large container">
                    <i class="fas fa-running fa-3x"></i>
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="card">
              <div class="card-content">
                <p class="title">Share with Friends</p>
                <p class="subtitle">
                  <span class="icon is-large container">
                    <i class="fas fa-users fa-3x"></i>
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="card">
              <div class="card-content">
                <p class="title">Analyze Your Progress</p>
                <p class="subtitle">
                  <span class="icon is-large container">
                    <i class="fas fa-chart-line fa-3x"></i>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  </main>
</template>

<style scoped>
.icon.is-large {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.card {
  transition: transform 0.3s;
  height: 100%;
  text-align: center;
}

.card:hover {
  transform: translateY(-5px);
}
</style>
