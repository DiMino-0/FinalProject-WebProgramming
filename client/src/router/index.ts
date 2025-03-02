import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
      component: () => import('@/views/ActivityView.vue'),
    },
    {
      path: '/Friends-Activities',
      name: 'friends',
      component: () => import('@/views/FriendsActivityView.vue'),
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('@/views/StatisticsView.vue'),
    },
    {
      path: '/people-search',
      name: 'search',
      component: () => import('@/views/PeopleSearchView.vue'),
    },
  ],
})

export default router
