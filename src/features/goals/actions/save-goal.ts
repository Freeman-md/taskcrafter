"use server"

import { currentUser } from "@clerk/nextjs/server"
import { saveGoal } from "../db/save-goal"
import { GoalWithTasks } from "../types"
import { mapGoalToDb } from "../mappers/map-to-db-records"
import { revalidatePath } from "next/cache"

export type SaveGoalResponse =
  | { success: true; goalId: string }
  | { success: false; error: string }

export async function saveGoalAction(goal: GoalWithTasks | null): Promise<SaveGoalResponse> {
  const user = await currentUser()

  if (!user) {
    return { success: false, error: "You must be signed in to save a plan." }
  }

  if (!goal) {
    return { success: false, error: "No goal to save." }
  }

  try {
    const { goalRecord, taskRecords } = mapGoalToDb(user.id, goal)

    const savedGoal = await saveGoal(user.id, goalRecord, taskRecords)

    revalidatePath("/goals")

    return { success: true, goalId: savedGoal.id }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to save goal plan." }
  }
}
