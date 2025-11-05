"use client";

import { useCallback, useState } from "react";

import { GoalForm, type GoalFormValues } from "@/components/goal-planner/goal-form";
import { PlanView } from "@/components/goal-planner/plan-view";

export default function GoalPlanner() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationId, setGenerationId] = useState(0);
  const [resetToken, setResetToken] = useState(0);
  const [activeGoal, setActiveGoal] = useState<GoalFormValues | null>(null);

  const handleGenerate = useCallback((values: GoalFormValues) => {
    setIsGenerating(true);
    setActiveGoal(values);
    setGenerationId((prev) => prev + 1);
  }, []);

  const handleClear = useCallback(() => {
    setIsGenerating(false);
    setGenerationId(0);
    setResetToken((prev) => prev + 1);
    setActiveGoal(null);
  }, []);

  const handlePlanRendered = useCallback(() => {
    setIsGenerating(false);
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="@container/goal-planner grid grid-cols-1 gap-4 px-4 md:gap-6 md:px-6 @[900px]/goal-planner:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <GoalForm isLoading={isGenerating} onGenerate={handleGenerate} onClear={handleClear} />
        <PlanView
          isLoading={isGenerating}
          generationId={generationId}
          resetToken={resetToken}
          goal={activeGoal}
          onPlanRendered={handlePlanRendered}
        />
      </div>
    </div>
  );
}
