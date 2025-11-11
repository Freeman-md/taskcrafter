"use client"

import { useCallback, useMemo, useState, useTransition, type FormEvent } from "react"
import type { z } from "zod"

import { PlanOutputSchema } from "@/lib/schemas"

export type GoalFormData = {
  goalTitle: string
  deadline: string
  context: string
}

export type FieldErrors = Partial<Record<keyof GoalFormData, string>>

export type StreamMessage = {
  id: string
  text: string
}

export type PlanResult = z.infer<typeof PlanOutputSchema>

export type GoalPlannerContextValue = {
  formData: GoalFormData
  updateFormField: (field: keyof GoalFormData, value: string) => void
  clearForm: () => void
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
  fieldErrors: FieldErrors
  messages: StreamMessage[]
  errorMessage: string | null
  isPending: boolean
  plan: PlanResult | null
}

export function useGoalPlannerController(): GoalPlannerContextValue {
  const [formData, setFormData] = useState<GoalFormData>({
    goalTitle: "",
    deadline: "",
    context: "",
  })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [messages, setMessages] = useState<StreamMessage[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [plan, setPlan] = useState<PlanResult | null>(null)
  const [isPending, startTransition] = useTransition()

  const updateFormField = useCallback((field: keyof GoalFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
  }, [])

  const clearForm = useCallback(() => {
    setFormData({ goalTitle: "", deadline: "", context: "" })
    setFieldErrors({})
    setMessages([])
    setErrorMessage(null)
    setPlan(null)
  }, [])

  const readStream = useCallback(async (stream: ReadableStream<Uint8Array>) => {
    const reader = stream.getReader()
    const decoder = new TextDecoder()
    let buffer = ""

    const appendMessage = (text: string) => {
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), text }])
    }

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split("\n")
      buffer = lines.pop() ?? ""

      lines.forEach((line) => {
        const parsed = parseLine(line)
        if (!parsed) return

        const completedPlan = extractPlan(parsed)
        if (completedPlan) {
          setPlan(completedPlan)
          return
        }

        const message = formatStreamPayload(parsed)
        if (message) appendMessage(message)
      })
    }

    if (buffer.trim()) {
      const parsed = parseLine(buffer.trim())
      if (parsed) {
        const completedPlan = extractPlan(parsed)
        if (completedPlan) {
          setPlan(completedPlan)
          return
        }

        const message = formatStreamPayload(parsed)
        if (message) appendMessage(message)
      }
    }
  }, [])

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setMessages([])
      setFieldErrors({})
      setErrorMessage(null)
      setPlan(null)

      startTransition(async () => {
        try {
          const response = await fetch("/api/goal/create-plan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: formData.goalTitle,
              deadline: formData.deadline,
              context: formData.context,
            }),
          })

          if (!response.ok || !response.body) {
            const data = await response.json().catch(async () => ({
              message: await response.text(),
            }))

            if (isValidationError(data)) {
              setFieldErrors(buildFieldErrors(data?.details?.issues))
              return
            }

            setErrorMessage(data.message ?? "Plan generation failed.")
            return
          }

          await readStream(response.body)
        } catch (error) {
          console.error("Goal planner submission failed:", error)
          setErrorMessage("Unexpected error while generating the plan.")
        }
      })
    },
    [formData, readStream],
  )

  return useMemo(
    () => ({
      formData,
      updateFormField,
      clearForm,
      handleSubmit,
      fieldErrors,
      messages,
      errorMessage,
      isPending,
      plan,
    }),
    [
      clearForm,
      errorMessage,
      fieldErrors,
      formData,
      handleSubmit,
      isPending,
      messages,
      plan,
      updateFormField,
    ],
  )
}

function parseLine(input: string) {
  try {
    return JSON.parse(input)
  } catch {
    return null
  }
}

function formatStreamPayload(payload: unknown) {
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

type ValidationPayload = {
  error: string
  details?: { issues?: Array<{ field?: string; message?: string }> }
  message?: string
}

function isValidationError(payload: unknown): payload is ValidationPayload {
  return (
    typeof payload === "object" &&
    payload !== null &&
    (payload as any).error === "VALIDATION_ERROR"
  )
}

function buildFieldErrors(
  issues: Array<{ field?: string; message?: string }> = [],
): FieldErrors {
  const map: Record<string, keyof GoalFormData> = {
    title: "goalTitle",
    goalTitle: "goalTitle",
    deadline: "deadline",
    context: "context",
  }

  return issues.reduce<FieldErrors>((acc, issue) => {
    if (!issue.field || !issue.message) return acc
    const key = map[issue.field]
    if (key) acc[key] = issue.message
    return acc
  }, {})
}

function extractPlan(payload: unknown): PlanResult | null {
  if (
    payload &&
    typeof payload === "object" &&
    "status" in payload &&
    (payload as any).status === "complete" &&
    "plan" in payload
  ) {
    const parsed = PlanOutputSchema.safeParse((payload as any).plan)
    if (parsed.success) {
      return parsed.data
    }
  }

  return null
}
