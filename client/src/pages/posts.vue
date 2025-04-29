<script setup lang="ts">
import type { Post } from '@/models/post'
import { isLoggedIn, refSession } from '@/models/session'
import { get } from '@/models/users'
import { ref } from 'vue'

const session = refSession()

const posts = ref(<Post[]>[])
if (session.value.user?.id !== undefined) {
  get(session.value.user.id).then((response) => {
    posts.value = response.posts ?? []
  })
}
</script>

<template>
  <main>
    <section class="body-container">
      <div class="container has-text-black">
        <div class="header">
          <h1 class="title is-1 has-text-black">Posts</h1>
          <div v-if="isLoggedIn() && posts.length > 0" class="subtitle-container">
            <h2 class="subtitle has-text-black">
              <span class="manage-text">Manage your posts here!</span>
            </h2>
          </div>
        </div>
        <div class="notification is-warning" v-if="!isLoggedIn()">
          Please log in to view and manage your posts.
        </div>
        <div class="container" v-else>
          <div v-if="posts.length === 0" class="no-posts-message">
            <p class="is-size-4">You haven't created any posts yet.</p>
            <p class="is-size-6">When you create posts, they will appear here.</p>
          </div>
          <template v-else>
            <div v-for="(post, index) in posts" :key="post.id" class="column is-one-third">
              <div class="card post">
                <div class="card-content">
                  <h2 class="title is-4 has-text-white">{{ post.title }}</h2>
                  <p class="subtitle is-6 has-text-white">
                    {{ post.post_message }}
                  </p>
                  <p class="subtitle is-6 has-text-white">
                    <strong>Created at:</strong> {{ post.created_on }}
                  </p>
                  <p class="subtitle is-6 has-text-white">
                    <strong>Author:</strong> {{ session.user?.username }}
                  </p>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
}

.post {
  background-color: rgb(233, 75, 75);
  border: none;
}

.card-content {
  flex-grow: 1;
  padding: 1.5rem;
}

.subtitle-container {
  padding: 0.5rem;
  border-radius: 8px;
  margin-top: 0.5rem;
}

.no-posts-message {
  text-align: center;
  padding: 3rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin: 2rem auto;
  max-width: 600px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}
</style>
