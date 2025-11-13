"use client"

import { useCallback, useMemo, useState, useTransition, type FormEvent } from "react"

import { FieldErrors, StreamMessage, ValidationErrorResponse } from "@/types"
import { buildFieldErrors, extractGoal, formatStreamPayload, parseLine } from "@/lib/goal-planner/parsers"
import { Goal, GoalFormData, GoalPlannerContextValue } from "../index"



export function useGoalPlannerController(): GoalPlannerContextValue {
  const [formData, setFormData] = useState<GoalFormData>({
    title: "",
    deadline: "",
    context: "",
  })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<GoalFormData>>({})
  const [streamMessages, setStreamMessages] = useState<StreamMessage[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [goal, setGoal] = useState<Goal | null>(null)
  const [isPending, startTransition] = useTransition()

  const updateFormField = useCallback((field: keyof GoalFormData, value: string) => {
    setFormData((previous: GoalFormData) => ({ ...previous, [field]: value }))
    setFieldErrors((previous) => ({ ...previous, [field]: undefined }))
  }, [])

  const clearData = useCallback(() => {
    setFieldErrors({})
    setStreamMessages([])
    setErrorMessage(null)
    setGoal(null)
  }, [])

  const clearForm = useCallback(() => {
    setFormData({ title: "", deadline: "", context: "" })    

    clearData()
  }, [clearData])

  const readStream = useCallback(async (stream: ReadableStream<Uint8Array>) => {
    const reader = stream.getReader()
    const decoder = new TextDecoder()
    let buffer = ""

    const appendMessage = (text: string) => {
      setStreamMessages((previous) => [...previous, { id: crypto.randomUUID(), text }])
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

        const completedGoal = extractGoal(parsed)
        if (completedGoal) {
          setGoal(completedGoal)
          return
        }

        const message = formatStreamPayload(parsed)
        if (message) appendMessage(message)
      })
    }

    if (buffer.trim()) {
      const parsed = parseLine(buffer.trim())
      if (parsed) {
        const completedGoal = extractGoal(parsed)
        if (completedGoal) {
          setGoal(completedGoal)
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

      clearData()

      startTransition(async () => {
        try {
          const response = await fetch("/api/goal/create-plan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: formData.title,
              deadline: formData.deadline,
              context: formData.context,
            }),
          })

          if (!response.ok || !response.body) {
            const data = await response.json() as ValidationErrorResponse

            if (data.error === "VALIDATION_ERROR" && data.details?.issues) {
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
    [formData, readStream, clearData],
  )

  return useMemo(
    () => ({
      formData,
      updateFormField,
      clearForm,
      handleSubmit,
      fieldErrors,
      streamMessages,
      errorMessage,
      isPending,
      goal,
    }),
    [
      clearForm,
      errorMessage,
      fieldErrors,
      formData,
      handleSubmit,
      isPending,
      streamMessages,
      goal,
      updateFormField,
    ],
  )
}