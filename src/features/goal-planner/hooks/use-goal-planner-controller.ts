"use client"

import { useCallback, useMemo, useState, useTransition, type FormEvent } from "react"

import { FieldErrors, StreamMessage, ValidationErrorResponse } from "@/types"
import { GoalFormData, GoalPlannerContextValue, GoalWithTasks } from "../types"
import { VALIDATION_ERROR } from "@/constants"
import { formatErrors } from "@/lib/validation"
import { modifyGoalTasks } from "../utils/modify-goal-tasks"



export function useGoalPlannerController(): GoalPlannerContextValue {
  const [formData, setFormData] = useState<GoalFormData>({
    title: "",
    deadline: "",
    context: "",
  })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<GoalFormData>>({})
  const [streamMessages, setStreamMessages] = useState<StreamMessage<GoalWithTasks>[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [goal, setGoal] = useState<GoalWithTasks | null>(null)
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

  const appendStreamMessage = (message: StreamMessage<GoalWithTasks>) => {
    setStreamMessages((prev) => [...prev, message])
  }

  const updateTask = useCallback(
    (taskId: string, field: "title" | "description", value: string) => {
      setGoal((prevState) => {
        if (!prevState) return prevState

        return {
          ...prevState,
          tasks: prevState.tasks.map((task) => {
            return task.id === taskId
              ? { ...task, [field]: value }
              : task
          })
        } as GoalWithTasks
      })
    },
    []
  )

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
          const parsedMessage = JSON.parse(trimmed) as StreamMessage<GoalWithTasks>
          appendStreamMessage(parsedMessage)

          if (parsedMessage.status === "complete" && parsedMessage.data) {
            setGoal(
              modifyGoalTasks(
                parsedMessage.data
              )
            )
          }
        } catch {
          console.error("Failed to parse streamed message:", trimmed)
        }
      }
    }

    // Handle any leftover data after the stream ends
    const remainingMessags = bufferedText.trim()
    if (remainingMessags) {
      try {
        const parsedMessage = JSON.parse(remainingMessags) as StreamMessage<GoalWithTasks>
        appendStreamMessage(parsedMessage)
      } catch {
        console.error("Failed to parse final buffered message:", remainingMessags)
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
      fieldErrors,
      streamMessages,
      errorMessage,
      isPending,
      goal,
      updateTask,
      updateFormField,
      clearForm,
      handleSubmit,
    }),
    [
      formData,
      fieldErrors,
      streamMessages,
      errorMessage,
      isPending,
      goal,
      updateTask,
      updateFormField,
      clearForm,
      handleSubmit,
    ],
  )
}