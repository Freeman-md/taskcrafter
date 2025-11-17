
import { FieldErrors, StreamMessage } from "@/types"
import { FormEvent } from "react"
import z from 'zod'
import { GoalInputSchema, GoalOutputSchema, TaskSchema } from "./goal.schema"

export type GoalInput = z.infer<typeof GoalInputSchema>

export type Goal = z.infer<typeof GoalOutputSchema> & {
  id?: string;
  completedTasks?: number
  totalTasks?: number
}

export type Task = z.infer<typeof TaskSchema>

export type GoalFormData = z.infer<typeof GoalInputSchema>

export type GoalPlannerContextValue = {
  formData: GoalFormData
  fieldErrors: FieldErrors<GoalFormData>
  streamMessages: StreamMessage<Goal>[]
  errorMessage: string | null
  isPending: boolean
  goal: Goal | null
  updateFormField: (field: keyof GoalFormData, value: string) => void
  updateTask: (taskId: string, field: "title" | "description", value: string) => void
  clearForm: () => void
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
}