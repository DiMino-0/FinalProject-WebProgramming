<script setup lang="ts">
defineProps(['title', 'date', 'duration', 'location', 'picture', 'type'])
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
          <a class="level-item" aria-label="delete">
            <span class="icon is-small">
              <i class="fas fa-times" aria-hidden="true" style="color: white"></i>
            </span>
          </a>
        </div>
      </nav>
    </article>
  </div>
</template>

<style scoped></style>
