export type ActivityType = "completed" | "new-goal" | "deadline"

export interface Activity {
  id: string
  type: ActivityType
  title: string
  detail: string
}
