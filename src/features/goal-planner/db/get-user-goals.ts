import { prisma } from "@/lib/prisma"
import { GoalWithTasks } from "../types"

export async function getUserGoals(userId: string): Promise<GoalWithTasks[]> {
  if (!userId) throw new Error("userId is required to fetch goals")

  return prisma.goal.findMany({
    where: { userId },
    include: { tasks: true },
    orderBy: { createdAt: "desc" },
  })
}
