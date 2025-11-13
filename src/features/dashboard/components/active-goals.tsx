import { Goal } from "@/features/goal-planner";
import Link from "next/link";
import { GoalCard } from "./goal-card";

const activeGoals: Goal[] = [
  {
    id: "goal-1",
    title: "Launch Mobile App",
    summary:
      "Complete development and deployment of the cross-platform app.",
    completedTasks: 12,
    totalTasks: 15,
    deadline: "2024-12-15",
    tasks: []
  },
  {
    id: "goal-2",
    title: "Team Onboarding",
    summary:
      "Roll out the comprehensive onboarding plan for new team members.",
    completedTasks: 8,
    totalTasks: 15,
    deadline: "2025-01-10",
    tasks: []
  },
  {
    id: "goal-3",
    title: "Automation Playbook",
    summary: "Document and automate the top five recurring workflows.",
    completedTasks: 5,
    totalTasks: 12,
    deadline: "2024-11-30",
    tasks: []
  },
];

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
      <div className="@container/active-goals">
        <div className="grid grid-cols-1 gap-4 @[700px]/active-goals:grid-cols-2">
          {activeGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      </div>
    </section>
  );
}
