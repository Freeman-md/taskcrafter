"use client";

import { useGoalPlanner } from "@/components/providers/goal-planner-provider";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/date";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { saveGoalAction } from "../actions/save-goal";
import { GoalWithTasks } from "../types";
import { TaskCard } from "./task-card";
import { Badge } from "@/components/ui/badge";

export default function CompletedPlanView({ goal }: { goal: GoalWithTasks }) {
  const { updateTask } = useGoalPlanner();
  const [isSaving, startSaving] = useTransition();
  const [openValue, setOpenValue] = useState(goal.title);

  const handleTitleChange = (taskId: string, value: string) =>
    updateTask(taskId, "title", value);

  const handleDescriptionChange = (taskId: string, value: string) =>
    updateTask(taskId, "description", value);

  const handleSavePlan = () =>
    startSaving(async () => {
      try {
        const result = await saveGoalAction(goal);

        if (!result.success) {
          toast.error(result.error);
          return;
        }

        toast.success("Plan saved successfully.");
      } catch (err) {
        console.error("Client transition error:", err);
        toast.error("Something went wrong on the client.");
      }
    });

  return (
    <div className="space-y-4">
      <Accordion
        type="single"
        collapsible
        className="space-y-2"
        value={openValue}
        onValueChange={setOpenValue}
      >
        <AccordionItem value={goal.title}>
          <AccordionTrigger
            variant="simple"
            triggerElement={
              <Badge variant="outline">
                {openValue === goal.title ? "Hide Tasks" : "Show Tasks"}
              </Badge>
            }
          >
            <div>
              <p className="text-base font-semibold text-foreground">
                {goal.title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {goal.summary}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Accordion type="multiple">
              {goal.tasks.map((task, index) => (
                <AccordionItem
                  key={task.id ?? `${task.title}-${index}`}
                  value={task.id ?? `${index}`}
                >
                  <AccordionTrigger className="px-3">
                    <div className="flex flex-1 items-center justify-between gap-3 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground">
                          {index + 1}.
                        </span>
                        <span className="font-medium text-foreground">
                          {task.title}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(task.deadline)}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <TaskCard
                      index={index}
                      id={task.id ?? `${index}`}
                      title={task.title}
                      description={task.description}
                      deadline={task.deadline ?? null}
                      status={task.status}
                      onChangeTitle={handleTitleChange}
                      onChangeDescription={handleDescriptionChange}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="pt-2">
        <Button
          variant="default"
          onClick={handleSavePlan}
          disabled={isSaving || !goal.tasks.length}
          className="w-full sm:w-auto"
        >
          {isSaving ? "Saving..." : "Save Plan"}
        </Button>
      </div>
    </div>
  );
}
