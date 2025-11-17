"use client";

import { IconListCheck } from "@tabler/icons-react";

import { useGoalPlanner } from "@/components/providers/goal-planner-provider";
import { StreamMessage } from "@/types";
import { GoalWithTasks } from "../types";
import CompletedPlanView from "./completed-plan-view";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  StreamingState,
} from "./view-states";

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

