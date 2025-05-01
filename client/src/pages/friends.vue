<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { isLoggedIn, refSession, apiCustomMethod } from '@/models/session'
import { getAll as getAllFriends, type Friend } from '@/models/friend'
import { type User } from '@/models/users'
import { getAllByUserId, type Post } from '@/models/post'
import type { Comment } from '@/models/comment'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

// Initialize reactive references
const session = refSession()
const friendships = ref<Friend[]>([])
const isLoading = ref(false)
const myFriends = ref<User[]>([])

// Track which friend's posts are being viewed
const viewingPostsOfFriendId = ref<number | null>(null)
const friendPosts = ref<Post[]>([])
const loadingPosts = ref(false)

// New comment form data
const newCommentText = ref<string>('')
const submittingComment = ref(false)
const commentingOnPostId = ref<number | null>(null)

// Add a ref to store comments for each post
const postComments = ref<{ [postId: number]: Comment[] }>({})

// Function to find friendship date for a specific friend
const getFriendshipDate = (friendId: string | number): string => {
  if (!session.value.user?.id) return ''

  const currentUserId = session.value.user.id
  const friendship = friendships.value.find(
    (f) =>
      (f.user_initiated_id === currentUserId && f.user_accepted_id === friendId) ||
      (f.user_initiated_id === friendId && f.user_accepted_id === currentUserId),
  )

  return friendship?.created_at ? dayjs(friendship.created_at).fromNow() : 'Unknown'
}

// Load friends when user is logged in
watchEffect(() => {
  if (isLoggedIn() && session.value.user?.id) {
    isLoading.value = true
    const currentUserId = session.value.user.id

    getAllFriends()
      .then((friendshipsResponse) => {
        friendships.value = friendshipsResponse.items

        // Filter friendships where current user is involved
        const myFriendships = friendships.value.filter(
          (friendship) =>
            friendship.user_initiated_id === currentUserId ||
            friendship.user_accepted_id === currentUserId,
        )

        // Create an array of friend user IDs
        const friendIds = myFriendships.map((friendship) =>
          friendship.user_initiated_id === currentUserId
            ? friendship.user_accepted_id
            : friendship.user_initiated_id,
        )

        // Clear existing friends and load them individually
        myFriends.value = []

        // Use Promise.all to fetch all friend users in parallel
        if (friendIds.length > 0) {
          const friendPromises = friendIds.map((friendId) =>
            import('@/models/users').then((module) => module.get(friendId)),
          )

          Promise.all(friendPromises)
            .then((friendUsers) => {
              myFriends.value = friendUsers
            })
            .catch((error) => {
              console.error('Error loading friend details:', error)
            })
            .finally(() => {
              isLoading.value = false
            })
        } else {
          isLoading.value = false
        }
      })
      .catch((error) => {
        console.error('Error loading friendships:', error)
        isLoading.value = false
      })
  } else {
    myFriends.value = []
  }
})

// Function to view a friend's posts
const viewFriendPosts = (friendId: number) => {
  if (viewingPostsOfFriendId.value === friendId) {
    // Toggle off if already viewing this friend's posts
    viewingPostsOfFriendId.value = null
    friendPosts.value = []
    postComments.value = {}
    return
  }

  loadingPosts.value = true
  viewingPostsOfFriendId.value = friendId

  getAllByUserId(friendId)
    .then((response) => {
      friendPosts.value = response.items

      // After loading posts, fetch comments for each post
      if (response.items.length > 0) {
        // Create a map to store comments by post ID
        const commentMap: { [postId: number]: Comment[] } = {}

        // Initialize all posts with empty comments array
        response.items.forEach((post) => {
          commentMap[post.id] = []
        })

        // Fetch all comments
        import('@/models/comment').then(({ getAllComments }) => {
          getAllComments()
            .then((commentsResponse) => {
              // Filter and organize comments by post ID
              commentsResponse.items.forEach((comment) => {
                if (response.items.some((post) => post.id === comment.post_id)) {
                  if (!commentMap[comment.post_id]) {
                    commentMap[comment.post_id] = []
                  }
                  commentMap[comment.post_id].push(comment)
                }
              })

              postComments.value = commentMap
            })
            .catch((error) => {
              console.error('Error loading comments:', error)
            })
        })
      }
    })
    .catch((error) => {
      console.error('Error loading friend posts:', error)
    })
    .finally(() => {
      loadingPosts.value = false
    })
}

// Function to get user info for a comment
const getCommentUser = (userId: number) => {
  return (
    myFriends.value.find((friend) => friend.id === userId) ||
    (session.value.user?.id === userId ? session.value.user : null)
  )
}

// Toggle comment form for a specific post
const toggleCommentForm = (postId: number | null) => {
  commentingOnPostId.value = postId
  newCommentText.value = ''
}

// Submit a new comment - update to refresh comments after submission
const submitComment = (postId: number) => {
  if (!newCommentText.value.trim() || !session.value.user?.id) return

  submittingComment.value = true

  const commentData = {
    comment_message: newCommentText.value,
    user_id: session.value.user.id,
    post_id: postId,
  }

  apiCustomMethod('comments', 'POST', commentData)
    .then((response) => {
      // Clear the form
      newCommentText.value = ''
      commentingOnPostId.value = null

      // Add the new comment to our local comments list
      if (!postComments.value[postId]) {
        postComments.value[postId] = []
      }
      postComments.value[postId].push(response as Comment)
    })
    .catch((error) => {
      console.error('Error adding comment:', error)
    })
    .finally(() => {
      submittingComment.value = false
    })
}
</script>

<template>
  <main>
    <section class="friends body-container">
      <div class="container has-text-black">
        <h1 class="title is-1 has-text-black">Friends' Posts</h1>
        <h2 class="subtitle has-text-black">
          <p>See what everyone else has been up to!</p>
        </h2>

        <div class="notification is-warning" v-if="!isLoggedIn()">
          Please log in to view your friends.
        </div>

        <div v-else>
          <!-- Loading indicator -->
          <div v-if="isLoading" class="has-text-centered p-5">
            <span class="icon is-large">
              <i class="fas fa-spinner fa-pulse fa-2x"></i>
            </span>
            <p class="is-size-4 mt-2">Loading friends...</p>
          </div>

          <!-- No friends message -->
          <div v-else-if="myFriends.length === 0" class="has-text-centered p-5">
            <span class="icon is-large">
              <i class="fas fa-user-friends fa-2x"></i>
            </span>
            <p class="is-size-4 mt-2">You don't have any friends yet.</p>
            <p class="is-size-6 mt-2">
              Visit the Search page to find users and add them as friends.
            </p>
          </div>

          <!-- Friends cards -->
          <div v-else class="columns is-multiline">
            <div v-for="friend in myFriends" :key="friend.id" class="column is-one-third">
              <div class="card friend-card">
                <div class="card-content">
                  <div class="media">
                    <div class="media-left">
                      <figure class="image is-48x48">
                        <img
                          :src="
                            friend.pfp_image_url || 'https://bulma.io/images/placeholders/96x96.png'
                          "
                          alt="Friend profile picture"
                          class="is-rounded"
                        />
                      </figure>
                    </div>
                    <div class="media-content">
                      <p class="title is-4 has-text-white">{{ friend.username }}</p>
                      <p class="subtitle is-6 has-text-white">{{ friend.email }}</p>
                    </div>
                  </div>
                  <div class="content has-text-white">
                    <p v-if="friend.gender"><strong>Gender:</strong> {{ friend.gender }}</p>
                    <p v-if="friend.posts">
                      <strong>Post Count:</strong> {{ friend.posts.length }}
                    </p>
                    <p class="is-size-7">
                      <time>Friends since: {{ getFriendshipDate(friend.id) }}</time>
                    </p>
                  </div>
                  <div class="buttons">
                    <button class="button is-small is-light" @click="viewFriendPosts(friend.id)">
                      <span class="icon"><i class="fas fa-eye"></i></span>
                      <span>{{
                        viewingPostsOfFriendId === friend.id ? 'Hide Posts' : 'View Posts'
                      }}</span>
                    </button>
                  </div>
                </div>

                <!-- Friend Posts Section -->
                <div v-if="viewingPostsOfFriendId === friend.id" class="friend-posts">
                  <div v-if="loadingPosts" class="has-text-centered p-3">
                    <span class="icon">
                      <i class="fas fa-spinner fa-pulse"></i>
                    </span>
                    <span>Loading posts...</span>
                  </div>

                  <div v-else-if="friendPosts.length === 0" class="no-posts p-3">
                    <p class="has-text-white">This friend hasn't posted anything yet.</p>
                  </div>

                  <div v-else class="posts-container">
                    <div v-for="post in friendPosts" :key="post.id" class="post-item p-3">
                      <div class="post-header">
                        <h4 class="is-size-5 has-text-white">{{ post.title }}</h4>
                        <span class="tag is-info">{{ post.type_of_activity }}</span>
                      </div>
                      <p class="has-text-white">{{ post.post_message }}</p>
                      <p class="has-text-white is-size-7">
                        <strong>{{ post.duration }}</strong> at
                        <strong>{{ post.location || 'Unknown location' }}</strong>
                      </p>
                      <p class="has-text-white is-size-7">
                        Posted: {{ dayjs(post.created_on).fromNow() }}
                      </p>

                      <!-- Display Comments Section -->
                      <div class="comments-section mt-3">
                        <h5 class="is-size-6 has-text-white mb-2">
                          <span class="icon"><i class="fas fa-comments"></i></span>
                          <span>Comments ({{ postComments[post.id]?.length || 0 }})</span>
                        </h5>

                        <div v-if="postComments[post.id]?.length > 0" class="comments-list">
                          <div
                            v-for="comment in postComments[post.id]"
                            :key="comment.id"
                            class="comment-box"
                          >
                            <div class="comment-header">
                              <div class="comment-user">
                                <figure class="image is-24x24 mr-2">
                                  <img
                                    :src="
                                      getCommentUser(comment.user_id)?.pfp_image_url ||
                                      'https://bulma.io/images/placeholders/24x24.png'
                                    "
                                    class="is-rounded"
                                    alt="User avatar"
                                  />
                                </figure>
                                <span class="has-text-white">
                                  {{
                                    getCommentUser(comment.user_id)?.username ||
                                    `User #${comment.user_id}`
                                  }}
                                </span>
                              </div>
                              <span class="has-text-white is-size-7">
                                {{ dayjs(comment.created_on).fromNow() }}
                              </span>
                            </div>
                            <p class="comment-content has-text-white">
                              {{ comment.comment_message }}
                            </p>
                          </div>
                        </div>

                        <div v-else class="has-text-white-ter is-size-7 no-comments">
                          No comments yet.
                        </div>
                      </div>

                      <!-- Comment button -->
                      <div class="mt-2">
                        <button
                          class="button is-small is-info is-light"
                          @click="toggleCommentForm(post.id)"
                        >
                          <span class="icon">
                            <i class="fas fa-comment"></i>
                          </span>
                          <span>Add Comment</span>
                        </button>
                      </div>

                      <!-- Comment form -->
                      <div v-if="commentingOnPostId === post.id" class="comment-form mt-2">
                        <div class="field">
                          <div class="control">
                            <textarea
                              class="textarea is-small"
                              v-model="newCommentText"
                              placeholder="Write your comment..."
                            ></textarea>
                          </div>
                        </div>
                        <div class="field is-grouped">
                          <div class="control">
                            <button
                              class="button is-small is-primary"
                              @click="submitComment(post.id)"
                              :class="{ 'is-loading': submittingComment }"
                              :disabled="!newCommentText.trim() || submittingComment"
                            >
                              Submit
                            </button>
                          </div>
                          <div class="control">
                            <button
                              class="button is-small is-light"
                              @click="toggleCommentForm(null)"
                              :disabled="submittingComment"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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

/* Friend card styling to match post cards */
.friend-card {
  background-color: rgb(233, 75, 75);
  border: none;
  height: 100%;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.friend-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(10, 10, 10, 0.2);
}

.image.is-48x48 {
  overflow: hidden;
}

.image.is-48x48 img {
  object-fit: cover;
  width: 48px;
  height: 48px;
}

.buttons {
  margin-top: 1rem;
}

.friend-posts {
  background-color: rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.post-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.75rem;
}

.post-item:last-child {
  border-bottom: none;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.comment-form {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.75rem;
  border-radius: 4px;
}

.textarea {
  background-color: white;
}

.mt-2 {
  margin-top: 0.5rem;
}

/* Comment styling */
.comments-section {
  margin-top: 1rem;
  border-top: 1px dashed rgba(255, 255, 255, 0.2);
  padding-top: 0.5rem;
}

.comments-list {
  margin-bottom: 1rem;
}

.comment-box {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.comment-user {
  display: flex;
  align-items: center;
}

.comment-content {
  padding-left: 2rem;
  word-break: break-word;
}

.no-comments {
  font-style: italic;
  opacity: 0.7;
  padding: 0.5rem;
}

.mt-3 {
  margin-top: 0.75rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mr-2 {
  margin-right: 0.5rem;
}
</style>
