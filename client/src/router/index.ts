import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ActivityView from '@/views/ActivityView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/my-activity',
      name: 'activity',
      // route level code-splitting
      // this generates a separate chunk ({Name}.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      //! unable to find module, component: () => import('../views/AboutView.vue')
      component: ActivityView,
    },
  ],
})

export default router
