import { ref } from 'vue'

export interface ActivityEntry {
  id: number
  title: string
  date: string
  duration: string
  location?: string
  picture?: string
  type: string
}

const entries = ref<ActivityEntry[]>([
  {
    id: 1,
    title: 'Climbing Everest',
    date: '2021-10-10',
    duration: '2 hours',
    location: 'Mount Everest',
    picture: '/bike.png',
    type: 'Hiking',
  },
  {
    id: 2,
    title: 'Crossing the Ocean!',
    date: '2021-10-11',
    duration: '1 hour',
    location: 'Pacific Ocean',
    picture: '/bike.png',
    type: 'Swimming',
  },
  {
    id: 3,
    title: 'Running in the park -_-',
    date: '2021-10-12',
    duration: '1 hour',
    location: 'Central Park',
    picture: '/bike.png',
    type: 'Running',
  },
])

export function refGetEntries() {
  return entries
}
