"use client";

import { IconListCheck } from "@tabler/icons-react";

import { TaskCard } from "@/features/goal-planner/components/task-card";
import { useGoalPlanner } from "@/components/providers/goal-planner-provider";
import { StreamMessage } from "@/types";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  StreamingState,
} from "./view-states";
import { GoalWithTasks } from "../types";


type GoalBreakdownContentProps = {
  isPending: boolean;
  hasMessages: boolean;
  streamMessages: StreamMessage<GoalWithTasks>[];
  errorMessage: string | null;
  goal: GoalWithTasks | null;
};

export function GoalBreakdown() {
  const { streamMessages, errorMessage, isPending, goal } = useGoalPlanner();

  const hasMessages = streamMessages.length > 0;

  return (
    <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-6 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <IconListCheck className="size-5 text-primary" />
        Plan preview
      </div>

      <div className="mt-3 text-sm text-muted-foreground/90">
        {renderContent({
          isPending,
          hasMessages,
          streamMessages,
          errorMessage,
          goal,
        })}
      </div>
    </div>
  );
}

function renderContent({
  isPending,
  hasMessages,
  streamMessages,
  errorMessage,
  goal,
}: GoalBreakdownContentProps) {
  if (errorMessage) {
    return <ErrorState message={errorMessage} />;
  }

  if (goal) {
    return <CompletedPlanView goal={goal} />;
  }

  if (isPending && !hasMessages) {
    return <LoadingState />;
  }

  if (hasMessages) {
    return (
      <StreamingState streamMessages={streamMessages} isPending={isPending} />
    );
  }

  return <EmptyState />;
}

function CompletedPlanView({ goal }: { goal: GoalWithTasks }) {
  const { updateTask } = useGoalPlanner();

  const handleTitleChange = (taskId: string, value: string) =>
    updateTask(taskId, "title", value);

  const handleDescriptionChange = (taskId: string, value: string) =>
    updateTask(taskId, "description", value);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-base font-semibold text-foreground">{goal.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{goal.summary}</p>
      </div>

      <div className="space-y-3">
        {goal.tasks.map((task, index) => (
          <TaskCard
            key={`${task.title}-${index}`}
            index={index}
            id={task.id}
            title={task.title}
            description={task.description}
            dueDate={task.dueDate}
            status={task.status}
            onChangeTitle={handleTitleChange}
            onChangeDescription={handleDescriptionChange}
          />
        ))}
      </div>
    </div>
  );
}
