import { GoalInputSchema, GoalOutputSchema } from "@/lib/schemas"
import { FieldErrors, StreamMessage } from "@/types"
import { FormEvent } from "react"
import z from 'zod'

export type GoalInput = z.infer<typeof GoalInputSchema>

export type Goal = z.infer<typeof GoalOutputSchema> & {
  id?: string;
  completedTasks?: number
  totalTasks?: number
}

export type GoalFormData = z.infer<typeof GoalInputSchema>

export type GoalPlannerContextValue = {
  formData: GoalFormData
  updateFormField: (field: keyof GoalFormData, value: string) => void
  clearForm: () => void
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
  fieldErrors: FieldErrors<GoalFormData>
  streamMessages: StreamMessage[]
  errorMessage: string | null
  isPending: boolean
  goal: Goal | null
}