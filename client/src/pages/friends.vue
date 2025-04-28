<script setup lang="ts">
// Format date to be more readable
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <main>
    <section class="friends body-container">
      <div class="container has-text-black">
        <h1 class="title is-1 has-text-black">Friends' Activities</h1>
        <h2 class="subtitle has-text-black">
          <p>See what everyone else has been up to!</p>
        </h2>
      </div>
    </section>
  </main>
</template>

<style scoped>
.activity-timeline {
  max-width: 800px;
}

.activities-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.activity-card {
  border-left: 4px solid #3273dc;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.activity-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.tag {
  margin-right: 0.5rem;
}

.mr-1 {
  margin-right: 0.25rem;
}
</style>
