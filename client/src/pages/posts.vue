<script setup lang="ts">
import { isLoggedIn, refSession } from '@/models/session'
import { get, getAll } from '@/models/users'
import type { Comment } from '@/models/comment'
import { type Post } from '@/models/post'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ref, watchEffect, computed } from 'vue'

const session = refSession()
const posts = ref(<Post[]>[])
const comments = ref(<Comment[]>[])
const isLoading = ref(false)
const users = ref<any[]>([]) // Store all users for reference

// Helper function to get comments for a specific post
const getCommentsForPost = (postId: number) => {
  // Ensure both are treated as numbers during comparison
  return comments.value.filter((comment) => Number(comment.post_id) === Number(postId))
}

// Find user by ID from list of all users
const findUserById = (userId: number) => {
  if (session.value.user?.id === userId) return session.value.user
  return users.value.find((user) => user.id === userId)
}

//watchEffect to react to session changes
watchEffect(() => {
  if (session.value.user?.id !== undefined) {
    isLoading.value = true
    getAll()
      .then((response) => {
        users.value = response.items
        posts.value = response.items.flatMap((user) => user.posts ?? [])
        comments.value = response.items.flatMap((user) => user.comments ?? [])
      })
      .then(() => {
        isLoading.value = false
      })
  } else {
    posts.value = []
    comments.value = []
  }
})

dayjs.extend(relativeTime)
</script>
<!-- TODO: Users should be able to modify any/all posts/comments that they have made, AND create new ones from this screen -->
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
          <div v-if="isLoading" class="is-flex is-justify-content-center p-5">
            <span class="is-size-4">Loading posts...</span>
          </div>
          <div v-else-if="posts.length === 0" class="no-posts-message">
            <p class="is-size-4">You haven't created any posts yet.</p>
            <p class="is-size-6">When you create posts, they will appear here.</p>
          </div>
          <template v-else>
            <div class="columns is-multiline">
              <div v-for="post in posts" :key="post.id" class="column is-one-third">
                <div class="card post">
                  <div class="card-content">
                    <h2 class="title is-4 has-text-white">{{ post.title }}</h2>
                    <p class="subtitle is-6 has-text-white">
                      {{ post.post_message }}
                    </p>
                    <p class="subtitle is-6 has-text-white">
                      <strong>Created at:</strong> {{ dayjs(post.created_on).fromNow() }}
                    </p>
                    <p class="subtitle is-6 has-text-white">
                      <strong>Author:</strong> {{ session.user?.username }}
                    </p>
                  </div>

                  <div class="card-content comments-section">
                    <h3 class="title is-5 has-text-white">Comments</h3>
                    <template v-if="getCommentsForPost(post.id).length === 0">
                      <div class="no-comments">
                        <p class="has-text-white">No comments yet.</p>
                      </div>
                    </template>
                    <template v-else>
                      <div
                        v-for="comment in getCommentsForPost(post.id)"
                        :key="comment.id"
                        class="comment-item"
                      >
                        <div class="comment-user">
                          <img
                            :src="findUserById(comment.user_id).pfp_image_url || 'imageNotFound'"
                            alt="User avatar"
                            class="comment-avatar"
                          />
                          <span class="comment-username has-text-white">
                            {{ findUserById(comment.user_id).username }}
                          </span>
                        </div>
                        <div class="comment-content">
                          <p class="subtitle is-6 has-text-white comment-text">
                            {{ comment.comment_message }}
                          </p>
                          <p class="subtitle is-6 has-text-white comment-time">
                            <strong>Commented at:</strong> {{ dayjs(comment.created_on).fromNow() }}
                          </p>
                        </div>
                      </div>
                    </template>
                  </div>
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

/* Comment styling with user info */
.comment-item {
  display: flex;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.comment-user {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 1rem;
  min-width: 60px;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 0.25rem;
}

.comment-username {
  font-size: 0.75rem;
  font-weight: bold;
  text-align: center;
  word-break: break-word;
}

.comment-content {
  flex: 1;
}

.comment-text {
  margin-bottom: 0.25rem !important;
}

.comment-time {
  font-size: 0.7rem !important;
  margin-bottom: 0 !important;
}
</style>
