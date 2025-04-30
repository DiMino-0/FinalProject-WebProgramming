export interface ActivityType {
  id: string
  label: string
  color?: string
}

export const activityTypes: ActivityType[] = [
  { id: 'running', label: 'Running', color: 'is-primary' },
  { id: 'cycling', label: 'Cycling', color: 'is-info' },
  { id: 'swimming', label: 'Swimming', color: 'is-link' },
  { id: 'yoga', label: 'Yoga', color: 'is-success' },
  { id: 'weightlifting', label: 'Weightlifting', color: 'is-danger' },
  { id: 'hiking', label: 'Hiking', color: 'is-warning' },
  { id: 'walking', label: 'Walking', color: 'is-light' },
  { id: 'basketball', label: 'Basketball', color: 'is-primary is-light' },
  { id: 'meditation', label: 'Meditation', color: 'is-info is-light' },
  { id: 'weight training', label: 'Weight Training', color: 'is-danger is-light' },
  { id: 'crossfit', label: 'Crossfit', color: 'is-success is-light' },
  { id: 'rock climbing', label: 'Rock Climbing', color: 'is-warning is-light' },
  { id: 'tennis', label: 'Tennis', color: 'is-link is-light' },
  { id: 'dancing', label: 'Dancing', color: 'is-primary is-light' },
  { id: 'kayaking', label: 'Kayaking', color: 'is-info is-light' },
  { id: 'martial arts', label: 'Martial Arts', color: 'is-danger is-light' },
  { id: 'pilates', label: 'Pilates', color: 'is-success is-light' },
  { id: 'other', label: 'Other', color: 'is-dark' },
]

export function getActivityTypeById(id: string): ActivityType {
  return (
    activityTypes.find((type) => type.id.toLowerCase() === id.toLowerCase()) || {
      id,
      label: id,
      color: 'is-light',
    }
  )
}

// Map of activity type IDs to activity type objects for quick lookup
export const activityTypeMap: Record<string, ActivityType> = Object.fromEntries(
  activityTypes.map((type) => [type.id.toLowerCase(), type]),
)
