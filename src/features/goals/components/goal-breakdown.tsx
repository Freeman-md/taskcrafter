"use client";

import { IconListCheck } from "@tabler/icons-react";

import { useGoalPlanner } from "@/components/providers/goal-planner-provider";
import { StreamMessage } from "@/types";
import { GoalWithTasks } from "../types";
import CompletedPlanView from "./completed-plan-view";
import StreamingState from "../../../components/ui/streaming-state";
import ErrorState from "@/components/ui/error-state";
import LoadingState from "@/components/ui/loading-state";
import EmptyState from "@/components/ui/empty-state";

type GoalBreakdownContentProps = {
  isGeneratingTasks: boolean;
  hasMessages: boolean;
  streamMessages: StreamMessage<GoalWithTasks>[];
  errorMessage: string | null;
  goal: GoalWithTasks | null;
};

export function GoalBreakdown() {
  const { streamMessages, errorMessage, isGeneratingTasks, goal } = useGoalPlanner();

  const hasMessages = streamMessages.length > 0;

  return (
    <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-6 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <IconListCheck className="size-5 text-primary" />
        Plan preview
      </div>

      <div className="mt-3 text-sm text-muted-foreground/90">
        {renderContent({
          isGeneratingTasks,
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
  isGeneratingTasks,
  hasMessages,
  streamMessages,
  errorMessage,
  goal,
}: GoalBreakdownContentProps) {
  
  if (errorMessage) {
    return (
      <ErrorState 
        error={new Error(errorMessage)} 
        title="Goal Generation Failed" 
      />
    );
  }

  if (goal) {
    return <CompletedPlanView goal={goal} />;
  }

  if (isGeneratingTasks && !hasMessages) {
    return (
      <LoadingState 
        message="Generating your goal plan…" 
      />
    );
  }

  if (hasMessages) {
    return (
      <StreamingState streamMessages={streamMessages} isGeneratingTasks={isGeneratingTasks} />
    );
  }

  return (
    <EmptyState 
      title="Start Planning" 
      description="Plan preview will appear here once you generate a goal."
    />
  );
}