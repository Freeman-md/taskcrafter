import { Goal, GoalFormData, GoalOutputSchema } from "@/features/goal-planner"
import { FieldErrors } from '@/types'

export function parseLine(input: string) {
  try {
    return JSON.parse(input)
  } catch {
    return null
  }
}

export function formatStreamPayload(payload: unknown) {
  if (typeof payload === "string") return payload

  if (payload && typeof payload === "object") {
    if ("message" in payload && typeof (payload as any).message === "string") {
      return (payload as any).message
    }
    if ("status" in payload && typeof (payload as any).status === "string") {
      return `Status: ${(payload as any).status}`
    }
    return JSON.stringify(payload)
  }

  return String(payload)
}

export function buildFieldErrors(
  issues: Array<{ field?: string; message?: string }> = [],
): FieldErrors<GoalFormData> {
  const map: Record<string, keyof GoalFormData> = {
    title: "title",
    deadline: "deadline",
    context: "context",
  }

  return issues.reduce<FieldErrors<GoalFormData>>((acc, issue) => {
    if (!issue.field || !issue.message) return acc
    const key = map[issue.field]
    if (key) acc[key] = issue.message
    return acc
  }, {})
}

export function extractGoal(payload: unknown): Goal | null {
  if (
    payload &&
    typeof payload === "object" &&
    "status" in payload &&
    (payload as any).status === "complete" &&
    "plan" in payload
  ) {
    const parsed = GoalOutputSchema.safeParse((payload as any).plan)
    if (parsed.success) {
      return parsed.data
    }
  }

  return null
}
