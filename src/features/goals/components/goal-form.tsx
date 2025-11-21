"use client";

import { IconInfoCircle, IconSparkles } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGoalPlanner } from "@/components/providers/goal-planner-provider";
import { Field } from "@/components/ui/form-field";

export function GoalForm() {
  const {
    formData,
    updateFormField,
    clearForm,
    handleSubmit,
    fieldErrors,
    isGeneratingTasks,
  } = useGoalPlanner();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Create a New Goal
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Title" htmlFor="title" error={fieldErrors.title}>
            <Input
              id="title"
              value={formData.title}
              onChange={(event) => updateFormField("title", event.target.value)}
              placeholder="Enter your goal..."
              required
              disabled={isGeneratingTasks}
            />
          </Field>

          <Field
            label="Deadline (Optional)"
            htmlFor="deadline"
            error={fieldErrors.deadline}
          >
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(event) =>
                updateFormField("deadline", event.target.value)
              }
              disabled={isGeneratingTasks}
            />
          </Field>

          <Field
            label="Context (Optional)"
            htmlFor="context"
            error={fieldErrors.context}
          >
            <Textarea
              id="context"
              value={formData.context}
              onChange={(event) =>
                updateFormField("context", event.target.value)
              }
              placeholder="Provide additional context or requirements..."
              rows={5}
              disabled={isGeneratingTasks}
            />
          </Field>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <Button type="submit" disabled={isGeneratingTasks} className="flex-1">
              <IconSparkles className="mr-2 size-4" />
              {isGeneratingTasks ? "Generating..." : "Generate Plan"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={clearForm}
              disabled={isGeneratingTasks}
            >
              Clear
            </Button>
          </div>

          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <IconInfoCircle className="mt-0.5 size-4" />
            AI will break your goal into structured steps and deadlines.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
