"use client"

import type { ReactNode } from "react"
import { IconInfoCircle, IconSparkles } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useGoalPlanner } from "@/components/providers/goal-planner-provider"

export function GoalForm() {
  const {
    formData,
    updateFormField,
    clearForm,
    handleSubmit,
    fieldErrors,
    isPending,
  } = useGoalPlanner()

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Create a New Goal
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <Field label="Goal Title" htmlFor="goal-title" error={fieldErrors.goalTitle}>
            <Input
              id="goal-title"
              value={formData.goalTitle}
              onChange={(event) =>
                updateFormField("goalTitle", event.target.value)
              }
              placeholder="Enter your goal..."
              required
              disabled={isPending}
            />
          </Field>

          <Field label="Deadline (Optional)" htmlFor="deadline" error={fieldErrors.deadline}>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(event) =>
                updateFormField("deadline", event.target.value)
              }
              disabled={isPending}
            />
          </Field>

          <Field label="Context (Optional)" htmlFor="context" error={fieldErrors.context}>
            <Textarea
              id="context"
              value={formData.context}
              onChange={(event) =>
                updateFormField("context", event.target.value)
              }
              placeholder="Provide additional context or requirements..."
              rows={5}
              disabled={isPending}
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
      </CardContent>
    </Card>
  )
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor?: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={htmlFor}>{label}</Label>
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
