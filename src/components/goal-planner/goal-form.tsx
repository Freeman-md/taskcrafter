"use client";

import { IconInfoCircle, IconSparkles } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function GoalForm() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Create a New Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="goal-title">Goal Title</Label>
            <Input id="goal-title" placeholder="Enter your goal..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline (Optional)</Label>
            <Input id="deadline" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="context">Context (Optional)</Label>
            <Textarea
              id="context"
              placeholder="Provide additional context or requirements..."
              rows={5}
            />
          </div>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <Button type="button" className="flex-1">
              <IconSparkles className="mr-2 size-4" />
              Generate Plan
            </Button>
            <Button type="button" variant="outline">
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
