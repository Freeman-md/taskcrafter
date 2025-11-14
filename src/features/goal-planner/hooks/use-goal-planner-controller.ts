"use client"

import { useCallback, useMemo, useState, useTransition, type FormEvent } from "react"

import { FieldErrors, StreamMessage, ValidationErrorResponse } from "@/types"
import { Goal, GoalFormData, GoalPlannerContextValue } from "../index"
import { VALIDATION_ERROR } from "@/constants"
import { formatErrors } from "@/lib/validation"



export function useGoalPlannerController(): GoalPlannerContextValue {
  const [formData, setFormData] = useState<GoalFormData>({
    title: "",
    deadline: "",
    context: "",
  })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<GoalFormData>>({})
  const [streamMessages, setStreamMessages] = useState<StreamMessage<Goal>[]>([])
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

  const appendStreamMessage = (message: StreamMessage<Goal>) => {
    setStreamMessages((prev) => [...prev, message])
  }

  const readStream = useCallback(async (stream: ReadableStream<Uint8Array>) => {
    const reader = stream.getReader()
    const textDecoder = new TextDecoder()

    // Stores incomplete pieces of JSON between chunks
    let bufferedText = ""

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      bufferedText += textDecoder.decode(value, { stream: true })

      // Split the buffer by newline-delimited messages
      const lines = bufferedText.split("\n")

      // Last item may be incomplete → keep it in the buffer
      bufferedText = lines.pop() ?? ""

      // Process all complete lines
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue

        try {
          const parsedMessage = JSON.parse(trimmed) as StreamMessage<Goal>
          appendStreamMessage(parsedMessage)
        } catch {
          console.error("Failed to parse streamed message:", trimmed)
        }
      }
    }

    // Handle any leftover data after the stream ends
    const remaining = bufferedText.trim()
    if (remaining) {
      try {
        const parsedMessage = JSON.parse(remaining) as StreamMessage<Goal>
        appendStreamMessage(parsedMessage)
      } catch {
        console.error("Failed to parse final buffered message:", remaining)
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

            if (data.error === VALIDATION_ERROR && data.details?.issues) {
              const formattedErrors = formatErrors(data.details.issues)

              setFieldErrors(formattedErrors)
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