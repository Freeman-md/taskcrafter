import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Goal } from "@/types/goal"


interface GoalCardProps {
  goal: Goal
}

function getProgressValue(goal: Goal) {
  if (!goal.totalTasks || goal.totalTasks <= 0) {
    return 0
  }

  return Math.min(100, Math.round((goal.completedTasks / goal.totalTasks) * 100))
}

function formatDueDate(input: string) {
  const date = new Date(input)

  if (Number.isNaN(date.getTime())) {
    return input
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

function getStatusColor(value: number) {
  if (value >= 80) return "bg-emerald-500"
  if (value >= 50) return "bg-amber-500"
  return "bg-primary"
}

export function GoalCard({ goal }: GoalCardProps) {
  const progressValue = getProgressValue(goal)
  const tasksSummary = `${goal.completedTasks}/${goal.totalTasks} tasks`

  return (
    <Card className="@container/goal-card h-full">
      <CardHeader className="gap-3 pb-2">
        <CardTitle className="text-lg font-semibold @[320px]/goal-card:text-xl">
          {goal.title}
        </CardTitle>
        <CardDescription className="@[320px]/goal-card:text-base">
          {goal.description}
        </CardDescription>
        <CardAction>
          <span
            aria-hidden
            className={`size-2.5 rounded-full ${getStatusColor(progressValue)}`}
          />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
          <span>Progress</span>
          <span className="text-foreground">{tasksSummary}</span>
        </div>
        <Progress value={progressValue} />
      </CardContent>
      <CardFooter className="flex flex-col gap-2 text-sm @[320px]/goal-card:flex-row @[320px]/goal-card:items-center @[320px]/goal-card:justify-between">
        <p className="text-muted-foreground">
          Due: <span className="text-foreground">{formatDueDate(goal.dueDate)}</span>
        </p>
        <Button variant="link" className="h-auto px-0 font-medium" asChild>
          <Link href="#">View Plan</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
