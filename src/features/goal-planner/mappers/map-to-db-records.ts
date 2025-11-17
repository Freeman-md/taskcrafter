import { normalizeDate } from "@/lib/date"
import { GoalWithTasks } from "../types"
import { Goal, Task } from "@prisma/client"

export function mapGoalToDb(userId: string, goal: GoalWithTasks) {
  const goalId = goal.id || crypto.randomUUID()

  const goalRecord: Goal = {
    id: goalId,
    userId,
    title: goal.title,
    summary: goal.summary,
    deadline: normalizeDate(goal.deadline),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const taskRecords: Task[] = goal.tasks.map((task) => ({
    id: task.id || crypto.randomUUID(),
    goalId,
    title: task.title,
    description: task.description ?? null,
    deadline: normalizeDate(task.deadline),
    status: task.status,
    createdAt: new Date(),
    updatedAt: new Date(),
  }))

  return { goalRecord, taskRecords }
}
