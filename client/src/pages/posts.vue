<script setup lang="ts">
import { isLoggedIn, refSession, apiCustomMethod } from '@/models/session'
import { getAll, type User } from '@/models/users'
import type { Comment } from '@/models/comment'
import { type Post, updatePost as apiUpdatePost } from '@/models/post'
import { activityTypes } from '@/models/activityTypes'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ref, watchEffect, computed } from 'vue'

const session = refSession()
const posts = ref(<Post[]>[])
const comments = ref(<Comment[]>[])
const isLoading = ref(false)
const users = ref<User[]>([])

const getCommentsForPost = (postId: number) => {
  // Ensure both are treated as numbers during comparison
  return comments.value.filter((comment) => Number(comment.post_id) === Number(postId))
}

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

        // Filter to only include posts from the current user
        const currentUserPosts =
          response.items.find((user) => user.id === session.value.user?.id)?.posts ?? []
        posts.value = currentUserPosts

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

const isModalActive = ref(false)
const editMode = ref(false)
const editPostId = ref<number | null>(null)
const newPost = ref({
  title: '',
  post_message: '',
  type_of_activity: '',
  duration: '',
  location: '',
  image_url: '',
  date: dayjs().format('YYYY-MM-DD'),
})
const formErrors = ref<string[]>([])
const isSubmitting = ref(false)

// Toggle modal visibility
const toggleModal = () => {
  isModalActive.value = !isModalActive.value
  // Reset form when opening in create mode
  if (isModalActive.value && !editMode.value) {
    resetForm()
  }
  // Reset edit mode when closing
  if (!isModalActive.value) {
    editMode.value = false
    editPostId.value = null
  }
}

// Reset form to default values
const resetForm = () => {
  newPost.value = {
    title: '',
    post_message: '',
    type_of_activity: '',
    duration: '',
    location: '',
    image_url: '',
    date: dayjs().format('YYYY-MM-DD'),
  }
  formErrors.value = []
}

// Open edit modal with post data
const editPost = (post: Post) => {
  editMode.value = true
  editPostId.value = post.id

  // Load post data into form
  newPost.value = {
    title: post.title,
    post_message: post.post_message,
    type_of_activity: post.type_of_activity,
    duration: post.duration,
    location: post.location || '',
    image_url: post.image_url || '',
    date: post.date,
  }

  // Open the modal
  isModalActive.value = true
}

// Validate form before submission
const validateForm = () => {
  formErrors.value = []

  if (!newPost.value.title.trim()) {
    formErrors.value.push('Title is required')
  }

  if (!newPost.value.post_message.trim()) {
    formErrors.value.push('Post message is required')
  }

  if (!newPost.value.type_of_activity.trim()) {
    formErrors.value.push('Activity type is required')
  }

  if (!newPost.value.duration.trim()) {
    formErrors.value.push('Duration is required')
  }

  return formErrors.value.length === 0
}

// Submit the new post or update existing post
const createPost = () => {
  if (!validateForm()) return

  isSubmitting.value = true

  // Add user_id to post data and ensure date is current
  const postData = {
    ...newPost.value,
    date: dayjs().format('YYYY-MM-DD'), // Always use current date
    user_id: session.value.user?.id,
  }

  // API call to create a new post
  apiCustomMethod('posts', 'POST', postData)
    .then((response) => {
      const newPost = Array.isArray(response) ? response[0] : response
      posts.value = [...posts.value, newPost]

      toggleModal()

      alert('Post created successfully!')
    })
    .catch((error) => {
      console.error('Error creating post:', error)
      formErrors.value = ['Failed to create post. Please try again.']
    })
    .finally(() => {
      isSubmitting.value = false
    })
}

// Update an existing post
const updatePost = () => {
  if (!validateForm() || !editPostId.value) return

  isSubmitting.value = true

  // Prepare data for update
  const postData = {
    ...newPost.value,
    date: dayjs().format('YYYY-MM-DD'),
  }

  apiUpdatePost(editPostId.value, postData)
    .then((response) => {
      const updatedPost = response as Post
      const index = posts.value.findIndex((post) => post.id === editPostId.value)

      if (index !== -1) {
        // Create a new array and replace the specific post
        const updatedPosts = [...posts.value]
        updatedPosts[index] = {
          ...posts.value[index],
          ...updatedPost,
          title: postData.title,
          post_message: postData.post_message,
          type_of_activity: postData.type_of_activity,
          duration: postData.duration,
          location: postData.location,
          image_url: postData.image_url,
          date: postData.date,
        }
        // Replace entire array to trigger reactivity
        posts.value = updatedPosts
      }

      // Close modal
      toggleModal()

      // Show success message
      alert('Post updated successfully!')
    })
    .catch((error) => {
      console.error('Error updating post:', error)
      formErrors.value = ['Failed to update post. Please try again.']
    })
    .finally(() => {
      isSubmitting.value = false
    })
}

// Submit handler that routes to the correct function
const submitForm = () => {
  if (editMode.value) {
    updatePost()
  } else {
    createPost()
  }
}
</script>

<template>
  <main>
    <section class="body-container">
      <div class="container has-text-black">
        <div class="header">
          <div class="is-flex is-justify-content-space-between is-align-items-center">
            <h1 class="title is-1 has-text-black">Posts</h1>
            <button v-if="isLoggedIn()" @click="toggleModal" class="button is-primary">
              <span class="icon">
                <i class="fas fa-plus"></i>
              </span>
              <span>Create Post</span>
            </button>
          </div>
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
              <div
                v-for="post in posts"
                :key="post.id + (post.created_on || '')"
                class="column is-full"
              >
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
                      <strong>Author:</strong>
                      {{ findUserById(post.user_id)?.username || 'Unknown' }}
                    </p>
                    <div class="post-actions">
                      <button class="button is-small is-info" @click="editPost(post)">
                        <span class="icon"><i class="fas fa-edit"></i></span>
                        <span>Edit</span>
                      </button>
                    </div>
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
                            :src="findUserById(comment.user_id)?.pfp_image_url || 'imageNotFound'"
                            alt="User avatar"
                            class="comment-avatar"
                          />
                          <span class="comment-username has-text-white">
                            {{ findUserById(comment.user_id)?.username || 'Unknown User' }}
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

        <!-- Create/Edit Post Modal -->
        <div class="modal" :class="{ 'is-active': isModalActive }">
          <div class="modal-background" @click="toggleModal"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">{{ editMode ? 'Edit Post' : 'Create New Post' }}</p>
              <button class="delete" aria-label="close" @click="toggleModal"></button>
            </header>
            <section class="modal-card-body">
              <!-- Form Errors -->
              <div v-if="formErrors.length > 0" class="notification is-danger">
                <ul>
                  <li v-for="(error, index) in formErrors" :key="index">{{ error }}</li>
                </ul>
              </div>

              <!-- Post Form -->
              <div class="field">
                <label class="label">Title</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    v-model="newPost.title"
                    placeholder="Post title"
                  />
                </div>
              </div>

              <div class="field">
                <label class="label">Message</label>
                <div class="control">
                  <textarea
                    class="textarea"
                    v-model="newPost.post_message"
                    placeholder="Write your post content here"
                  ></textarea>
                </div>
              </div>

              <div class="columns">
                <div class="column">
                  <div class="field">
                    <label class="label">Activity Type</label>
                    <div class="control">
                      <div class="select is-fullwidth">
                        <select v-model="newPost.type_of_activity">
                          <option value="" disabled>Select activity type</option>
                          <option
                            v-for="activity in activityTypes"
                            :key="activity.id"
                            :value="activity.id"
                          >
                            {{ activity.label }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="column">
                  <div class="field">
                    <label class="label">Duration</label>
                    <div class="control">
                      <input
                        class="input"
                        type="text"
                        v-model="newPost.duration"
                        placeholder="e.g. 30 minutes, 1 hour"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="field">
                <label class="label">Location (optional)</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    v-model="newPost.location"
                    placeholder="Where did this activity take place?"
                  />
                </div>
              </div>

              <div class="field">
                <label class="label">Image URL (optional)</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    v-model="newPost.image_url"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div class="field">
                <label class="label">Date</label>
                <div class="control">
                  <input class="input" type="text" :value="dayjs().format('YYYY-MM-DD')" readonly />
                </div>
              </div>
            </section>
            <footer class="modal-card-foot">
              <button
                class="button is-primary"
                @click="submitForm"
                :class="{ 'is-loading': isSubmitting }"
                :disabled="isSubmitting"
              >
                {{ editMode ? 'Update Post' : 'Create Post' }}
              </button>
              <button class="button" @click="toggleModal" :disabled="isSubmitting">Cancel</button>
            </footer>
          </div>
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

/* Modal styling */
.modal-card {
  width: 80%;
  max-width: 800px;
}

.select select option {
  color: #363636;
}

.post-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
}

.post-actions .button {
  transition: all 0.2s ease;
}

.post-actions .button:hover {
  transform: translateY(-2px);
}
</style>
