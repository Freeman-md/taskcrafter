import { IconInfoCircle, IconSparkles, IconListCheck } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function GoalPlanner() {
  return (
    <div className="@container/goal-planner flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="grid grid-cols-1 gap-4 px-4 md:gap-6 md:px-6 @[800px]/goal-planner:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <GoalFormSkeleton />
        <div className="flex flex-col gap-4">
          <PlanPlaceholder />
          <div className="space-y-3">
            <TaskCard />
            <TaskCard />
            <TaskCard />
          </div>
        </div>
      </div>
    </div>
  );
}

function GoalFormSkeleton() {
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

function PlanPlaceholder() {
  return (
    <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-6 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <IconListCheck className="size-5 text-primary" />
        Plan preview will appear here.
      </div>
      <p className="mt-2 text-sm text-muted-foreground/80">
        This area will display the generated plan once the new data flow is implemented.
      </p>
    </div>
  );
}

function TaskCard() {
  return (
    <div className="rounded-xl border border-border/70 bg-card/80 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">1</span>
          Outline product scope
        </div>
        <span className="text-xs font-medium text-muted-foreground">Due Oct 12</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Define the core problem, guardrails, and success metrics before kicking off execution.
      </p>
    </div>
  );
}
