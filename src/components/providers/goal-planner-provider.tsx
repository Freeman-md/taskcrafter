"use client"

import { createContext, useContext, type ReactNode } from "react"
import {
  useGoalPlannerController,
  type GoalPlannerContextValue,
} from "@/hooks/useGoalPlanner"

const GoalPlannerContext = createContext<GoalPlannerContextValue | null>(null)

export function GoalPlannerProvider({ children }: { children: ReactNode }) {
  const value = useGoalPlannerController()
  return (
    <GoalPlannerContext.Provider value={value}>
      {children}
    </GoalPlannerContext.Provider>
  )
}

export function useGoalPlanner() {
  const context = useContext(GoalPlannerContext)
  if (!context) {
    throw new Error("useGoalPlanner must be used within GoalPlannerProvider")
  }
  return context
}
