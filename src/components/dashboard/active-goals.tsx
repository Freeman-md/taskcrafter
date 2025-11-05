import Link from "next/link"

import { GoalCard } from "./goal-card"
import type { Goal } from "@/types/goal"

const activeGoals: Goal[] = [
  {
    id: "goal-1",
    title: "Launch Mobile App",
    description: "Complete development and deployment of the cross-platform app.",
    completedTasks: 12,
    totalTasks: 15,
    dueDate: "2024-12-15",
  },
  {
    id: "goal-2",
    title: "Team Onboarding",
    description: "Roll out the comprehensive onboarding plan for new team members.",
    completedTasks: 8,
    totalTasks: 15,
    dueDate: "2025-01-10",
  },
  {
    id: "goal-3",
    title: "Automation Playbook",
    description: "Document and automate the top five recurring workflows.",
    completedTasks: 5,
    totalTasks: 12,
    dueDate: "2024-11-30",
  },
]

export default function ActiveGoals() {
  return (
    <section className="flex flex-col gap-5 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground md:text-xl">
          Active Goals
        </h2>
        <Link
          href="#"
          className="text-sm font-medium text-primary transition hover:text-primary/80"
        >
          View All
        </Link>
      </div>
      <div className="@container/active-goals grid grid-cols-1 gap-4 @[900px]/active-goals:grid-cols-2">
        {activeGoals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </section>
  )
}
