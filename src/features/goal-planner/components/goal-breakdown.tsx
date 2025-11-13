"use client";

import { IconListCheck, IconLoader2 } from "@tabler/icons-react";

import { TaskCard } from "@/features/goal-planner/components/task-card";
import { useGoalPlanner } from "@/components/providers/goal-planner-provider";
import { Goal } from "../index";

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

type GoalBreakdownContentProps = {
  isPending: boolean;
  hasMessages: boolean;
  streamMessages: { id: string; text: string }[];
  errorMessage: string | null;
  goal: Goal | null;
};

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
    return <StreamingState streamMessages={streamMessages} isPending={isPending} />;
  }

  return <EmptyState />;
}

function EmptyState() {
  return (
    <p className="text-sm text-muted-foreground">
      Plan preview will appear here once you generate a goal.
    </p>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center gap-3 text-muted-foreground">
      <IconLoader2 className="size-4 animate-spin text-primary" />
      <span>Generating your goal plan…</span>
    </div>
  );
}

function StreamingState({
  streamMessages,
  isPending,
}: {
  streamMessages: { id: string; text: string }[];
  isPending: boolean;
}) {
  return (
    <div className="space-y-3">
      {isPending && (
        <p className="text-xs font-medium text-primary">Streaming live…</p>
      )}
      <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-border/60 bg-background/80 p-3 text-foreground shadow-inner">
        {streamMessages.map((message) => (
          <p key={message.id} className="text-sm font-mono leading-relaxed">
            {message.text}
          </p>
        ))}
      </div>
    </div>
  );
}

function CompletedPlanView({ goal }: { goal: Goal }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-base font-semibold text-foreground">
          {goal.title}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{goal.summary}</p>
      </div>

      <div className="space-y-3">
        {goal.tasks.map((task, index) => (
          <TaskCard
            key={`${task.title}-${index}`}
            index={index}
            title={task.title}
            description={task.description}
            dueDate={task.dueDate}
            status={task.status}
          />
        ))}
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-destructive">
      {message}
    </div>
  );
}
