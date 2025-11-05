"use client";

import { useEffect, useMemo, useState } from "react";
import {
  IconRefresh,
  IconDownload,
  IconDeviceFloppy,
  IconListCheck,
  IconLoader2,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { EmptyState } from "./empty-state";
import type { GoalFormValues } from "./goal-form";

interface PlanStep {
  id: string;
  title: string;
  description: string;
  dueDate: string;
}

interface PlanViewProps {
  isLoading: boolean;
  generationId: number;
  resetToken: number;
  goal: GoalFormValues | null;
  onPlanRendered(): void;
}

const mockPlan: PlanStep[] = [
  {
    id: "1",
    title: "Define product scope",
    description: "Outline core features, KPIs, and success metrics for the launch.",
    dueDate: "2024-10-10",
  },
  {
    id: "2",
    title: "Assemble cross-functional team",
    description: "Assign owners for design, engineering, and marketing workstreams.",
    dueDate: "2024-10-15",
  },
  {
    id: "3",
    title: "Draft go-to-market narrative",
    description: "Create messaging, launch checklist, and content outline for campaign.",
    dueDate: "2024-10-20",
  },
  {
    id: "4",
    title: "Run usability testing",
    description: "Host sessions with target users to validate onboarding and flows.",
    dueDate: "2024-10-27",
  },
];

export function PlanView({ isLoading, generationId, resetToken, goal, onPlanRendered }: PlanViewProps) {
  const [planSteps, setPlanSteps] = useState<PlanStep[]>([]);

  useEffect(() => {
    if (!generationId) return;

    const timeout = setTimeout(() => {
      setPlanSteps([]);
      setPlanSteps(mockPlan);
      onPlanRendered();
    }, 1200);

    return () => clearTimeout(timeout);
  }, [generationId, onPlanRendered]);

  useEffect(() => {
    if (resetToken) {
      const timeout = setTimeout(() => {
        setPlanSteps([]);
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [resetToken]);

  const hasPlan = planSteps.length > 0;

  const planItems = useMemo(
    () =>
      planSteps.map((step, index) => (
        <li key={step.id} className="flex flex-col gap-2 rounded-lg border border-border/80 bg-card/60 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-full text-xs font-semibold">
                {index + 1}
              </span>
              <p className="text-sm font-medium text-foreground md:text-base">{step.title}</p>
            </div>
            <span className="text-xs font-medium text-muted-foreground">Due {formatDate(step.dueDate)}</span>
          </div>
          <p className="text-sm text-muted-foreground">{step.description}</p>
        </li>
      )),
    [planSteps],
  );

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <IconListCheck className="size-5 text-primary" />
          Plan Overview
        </CardTitle>
        {hasPlan && (
          <div className="hidden gap-2 md:flex">
            <Button size="sm" variant="outline" disabled>
              <IconDeviceFloppy className="mr-2 size-4" />
              Save
            </Button>
            <Button size="sm" variant="outline" disabled>
              <IconRefresh className="mr-2 size-4" />
              Regenerate
            </Button>
            <Button size="sm" variant="outline" disabled>
              <IconDownload className="mr-2 size-4" />
              Export JSON
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-4">
        {goal && (goal.goalTitle || goal.deadline) && (
          <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">
              Goal: <span className="font-semibold">{goal.goalTitle}</span>
            </p>
            {goal.deadline && <p>Deadline: {formatDate(goal.deadline)}</p>}
            {goal.context && <p className="mt-1 text-sm">Context: {goal.context}</p>}
          </div>
        )}

        {!hasPlan && !isLoading && (
          <EmptyState
            title="No plan yet"
            subtitle={"Enter your goal details and click \"Generate Plan\" to get started."}
          />
        )}

        {isLoading && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
            <IconLoader2 className="size-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Generating your plan...</p>
          </div>
        )}

        {hasPlan && !isLoading && (
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex flex-col gap-2 md:hidden">
              <Separator />
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" disabled className="flex-1">
                  <IconDeviceFloppy className="mr-2 size-4" />
                  Save
                </Button>
                <Button size="sm" variant="outline" disabled className="flex-1">
                  <IconRefresh className="mr-2 size-4" />
                  Regenerate
                </Button>
                <Button size="sm" variant="outline" disabled className="flex-1">
                  <IconDownload className="mr-2 size-4" />
                  Export JSON
                </Button>
              </div>
            </div>
            <Separator />
            <ul className="flex max-h-[460px] flex-col gap-3 overflow-y-auto pr-1">
              {planItems}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function formatDate(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return input;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
