import { normalizeDate } from "@/lib/date"
import { prisma } from "@/lib/prisma"
import { Goal, Task } from "@prisma/client"

export async function saveGoal(userId: string, goal: Goal, tasks: Task[]): Promise<Goal> {
  if (!userId) throw new Error("userId is required to save a plan")
  if (!goal.title || !goal.summary) throw new Error("Goal must include a title and summary")

  const goalId = goal.id || crypto.randomUUID()
  const deadline = normalizeDate(goal.deadline)

  const taskData = tasks.map((task) => ({
    id: task.id || crypto.randomUUID(),
    goalId,
    title: task.title,
    description: task.description ?? null,
    deadline: normalizeDate(task.deadline),
    status: task.status,
  }))

  return prisma.$transaction(async (transaction) => {
    const savedGoal = await transaction.goal.upsert({
      where: { id: goalId },
      create: {
        id: goalId,
        userId,
        title: goal.title,
        summary: goal.summary,
        deadline,
      },
      update: {
        userId,
        title: goal.title,
        summary: goal.summary,
        deadline,
      },
    })

    await transaction.task.deleteMany({ where: { goalId: savedGoal.id } })

    if (taskData.length) {
      await transaction.task.createMany({
        data: taskData.map((task) => ({
          ...task,
          goalId: savedGoal.id,
        })),
      })
    }

    return transaction.goal.findUniqueOrThrow({
      where: { id: savedGoal.id },
      include: { tasks: true },
    })
  })
}
