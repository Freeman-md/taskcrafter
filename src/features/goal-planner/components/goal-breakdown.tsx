"use client";

import { IconListCheck, IconLoader2 } from "@tabler/icons-react";

import { TaskCard } from "@/features/goal-planner/components/task-card";
import { useGoalPlanner } from "@/components/providers/goal-planner-provider";
import { Goal } from "../index";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { StreamMessage } from "@/types";

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
          goal
        })}
      </div>
    </div>
  );
}

type GoalBreakdownContentProps = {
  isPending: boolean;
  hasMessages: boolean;
  streamMessages: StreamMessage<Goal>[];
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
    return (
      <StreamingState streamMessages={streamMessages} isPending={isPending} />
    );
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
  streamMessages: StreamMessage<Goal>[];
  isPending: boolean;
}) {
  const latestMessage = streamMessages
    .filter((message) => message.status !== "complete")
    .at(-1); // last message

  return (
    <div className="space-y-3">
      {isPending && (
        <p className="text-xs font-medium text-primary">Streaming live…</p>
      )}

      <div className="rounded-lg border bg-background/80 p-3 shadow-inner">
        {latestMessage ? (
          <div className="animate-pulse rounded-md bg-muted/40 px-3 py-2">
            <p className="text-sm font-mono text-muted-foreground">
              {latestMessage.text}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Preparing first steps…
          </p>
        )}
      </div>
    </div>
  );
}



function CompletedPlanView({ goal }: { goal: Goal }) {
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
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>{message}</AlertTitle>
    </Alert>
  );
}
