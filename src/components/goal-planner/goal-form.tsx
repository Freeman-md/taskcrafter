"use client";

import { useState } from "react";
import { IconInfoCircle, IconSparkles } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface GoalFormValues {
  goalTitle: string;
  deadline: string;
  context: string;
}

interface GoalFormProps {
  isLoading: boolean;
  onGenerate(values: GoalFormValues): void;
  onClear(): void;
}

export function GoalForm({ isLoading, onGenerate, onClear }: GoalFormProps) {
  const [values, setValues] = useState<GoalFormValues>({
    goalTitle: "",
    deadline: "",
    context: "",
  });

  const handleChange = <Field extends keyof GoalFormValues>(field: Field, value: GoalFormValues[Field]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onGenerate(values);
  };

  const handleClear = () => {
    setValues({ goalTitle: "", deadline: "", context: "" });
    onClear();
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Create a New Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="goal-title">Goal Title</Label>
            <Input
              id="goal-title"
              value={values.goalTitle}
              onChange={(event) => handleChange("goalTitle", event.target.value)}
              placeholder="Enter your goal..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline (Optional)</Label>
            <Input
              id="deadline"
              type="date"
              value={values.deadline}
              onChange={(event) => handleChange("deadline", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="context">Context (Optional)</Label>
            <Textarea
              id="context"
              value={values.context}
              onChange={(event) => handleChange("context", event.target.value)}
              placeholder="Provide additional context or requirements..."
              rows={5}
            />
          </div>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              <IconSparkles className="mr-2 size-4" />
              {isLoading ? "Generating..." : "Generate Plan"}
            </Button>
            <Button type="button" variant="outline" onClick={handleClear} disabled={isLoading}>
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
