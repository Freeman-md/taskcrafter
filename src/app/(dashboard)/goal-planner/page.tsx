import { GoalPlannerProvider } from "@/components/providers/goal-planner-provider";
import { GoalBreakdown, GoalForm } from "@/features/goal-planner";

export default function GoalPlanner() {
  return (
    <GoalPlannerProvider>
      <div className="@container/goal-planner flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="grid grid-cols-1 gap-4 px-4 md:gap-6 md:px-6 @[800px]/goal-planner:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <GoalForm />
          <div className="flex flex-col gap-4">
            <GoalBreakdown />
          </div>
        </div>
      </div>
    </GoalPlannerProvider>
  );
}
