"use client";

import { useGoalPlannerController } from "@/features/goal-planner/hooks/use-goal-planner-controller";
import { GoalPlannerContextValue } from "@/features/goal-planner/types";
import { createContext, useContext, type ReactNode } from "react";

const GoalPlannerContext = createContext<GoalPlannerContextValue | null>(null);

export function GoalPlannerProvider({ children }: { children: ReactNode }) {
  const value = useGoalPlannerController();
  return (
    <GoalPlannerContext.Provider value={value}>
      {children}
    </GoalPlannerContext.Provider>
  );
}

export function useGoalPlanner() {
  const context = useContext(GoalPlannerContext);
  if (!context) {
    throw new Error("useGoalPlanner must be used within GoalPlannerProvider");
  }
  return context;
}
