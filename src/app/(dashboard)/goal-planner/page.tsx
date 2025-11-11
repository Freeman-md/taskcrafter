import { GoalForm } from "@/components/goal-planner/goal-form";
import { PlanStatus } from "@/components/goal-planner/plan-status";
import { GoalPlannerProvider } from "@/components/providers/goal-planner-provider";

export default function GoalPlanner() {
  return (
    <GoalPlannerProvider>
      <div className="@container/goal-planner flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="grid grid-cols-1 gap-4 px-4 md:gap-6 md:px-6 @[800px]/goal-planner:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <GoalForm />
          <div className="flex flex-col gap-4">
            <PlanStatus />
            <div className="space-y-3">
              <TaskCard />
              <TaskCard />
              <TaskCard />
            </div>
          </div>
        </div>
      </div>
    </GoalPlannerProvider>
  )
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
