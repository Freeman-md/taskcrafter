
import { FieldErrors, StreamMessage } from "@/types"
import { FormEvent } from "react"
import z from 'zod'
import { Goal, Task } from "../../../prisma/generated/zod"
import { AIGoalInputSchema } from "./schemas/ai-schema"

export type GoalWithTasks = Goal & {
  tasks: Task[]
}

export type GoalInput = z.infer<typeof AIGoalInputSchema>

export type GoalFormData = z.infer<typeof AIGoalInputSchema>

export type GoalPlannerContextValue = {
  formData: GoalFormData
  fieldErrors: FieldErrors<GoalFormData>
  streamMessages: StreamMessage<GoalWithTasks>[]
  errorMessage: string | null
  isGeneratingTasks: boolean
  goal: GoalWithTasks | null
  updateFormField: (field: keyof GoalFormData, value: string) => void
  updateTask: (taskId: string, field: "title" | "description", value: string) => void
  clearForm: () => void
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
}
