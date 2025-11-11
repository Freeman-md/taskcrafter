"use client"

import { useState, useTransition } from "react"
import { IconInfoCircle, IconSparkles } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type GoalFormData = {
  goalTitle: string
  deadline: string
  context: string
}

type FieldErrors = {
  goalTitle?: string
  deadline?: string
  context?: string
}

type StreamEvent = {
  id: string
  text: string
}

export function GoalForm() {
  const [formData, setFormData] = useState<GoalFormData>({
    goalTitle: "",
    deadline: "",
    context: "",
  })

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [streamMessages, setStreamMessages] = useState<StreamEvent[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function updateFormField(field: keyof GoalFormData, value: string) {
    setFormData((previous) => ({ ...previous, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: undefined })) // clear error when typing
  }

  function clearForm() {
    setFormData({ goalTitle: "", deadline: "", context: "" })
    setStreamMessages([])
    setFieldErrors({})
    setErrorMessage(null)
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setStreamMessages([])
    setFieldErrors({})
    setErrorMessage(null)

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

        // Handle validation and general API errors
        if (!response.ok || !response.body) {
          const data = await response.json().catch(() => ({}))

          if (data.error === "VALIDATION_ERROR" && data.details?.issues) {
            const issues: FieldErrors = {}
            for (const issue of data.details.issues) {
              if (issue.field && issue.message) {
                issues[issue.field as keyof GoalFormData] = issue.message
              }
            }
            setFieldErrors(issues)
            return
          }

          setErrorMessage(data.message ?? "Plan generation failed.")
          return
        }

        await readStream(response.body)
      } catch {
        setErrorMessage("Unexpected error while generating the plan.")
      }
    })
  }

  async function readStream(streamBody: ReadableStream<Uint8Array>) {
    const reader = streamBody.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      for (const line of chunk.split("\n")) {
        if (!line.trim()) continue

        try {
          const event = JSON.parse(line)
          const text =
            typeof event === "object" && "message" in event
              ? event.message
              : JSON.stringify(event)

          setStreamMessages((prev) => [
            ...prev,
            { id: crypto.randomUUID(), text },
          ])
        } catch {
          // ignore partial lines
        }
      }
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Create a New Goal
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Goal Title" error={fieldErrors.goalTitle}>
            <Input
              id="goal-title"
              value={formData.goalTitle}
              onChange={(event) =>
                updateFormField("goalTitle", event.target.value)
              }
              placeholder="Enter your goal..."
              required
            />
          </Field>

          <Field label="Deadline (Optional)" error={fieldErrors.deadline}>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(event) =>
                updateFormField("deadline", event.target.value)
              }
            />
          </Field>

          <Field label="Context (Optional)" error={fieldErrors.context}>
            <Textarea
              id="context"
              value={formData.context}
              onChange={(event) =>
                updateFormField("context", event.target.value)
              }
              placeholder="Provide additional context or requirements..."
              rows={5}
            />
          </Field>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <Button type="submit" disabled={isPending} className="flex-1">
              <IconSparkles className="mr-2 size-4" />
              {isPending ? "Generating..." : "Generate Plan"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={clearForm}
              disabled={isPending}
            >
              Clear
            </Button>
          </div>

          <Hint />
        </form>

        <ResponsePanel
          messages={streamMessages}
          error={errorMessage}
        />
      </CardContent>
    </Card>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      {children}
      {error && (
        <p className="text-xs text-destructive mt-0.5">{error}</p>
      )}
    </div>
  )
}

function Hint() {
  return (
    <p className="flex items-start gap-2 text-sm text-muted-foreground">
      <IconInfoCircle className="mt-0.5 size-4" />
      AI will break your goal into structured steps and deadlines.
    </p>
  )
}

function ResponsePanel({
  messages,
  error,
}: {
  messages: StreamEvent[]
  error: string | null
}) {
  return (
    <div className="mt-6 space-y-2 rounded-lg border border-border/80 bg-muted/10 p-4">
      <p className="text-sm font-medium text-muted-foreground">Live response</p>

      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : messages.length === 0 ? (
        <p className="text-sm text-muted-foreground/80">
          Streaming output will appear here.
        </p>
      ) : (
        <div className="max-h-56 space-y-2 overflow-y-auto pr-2 text-sm font-mono text-foreground">
          {messages.map((message) => (
            <p key={message.id}>{message.text}</p>
          ))}
        </div>
      )}
    </div>
  )
}
