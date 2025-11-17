"use client";

import { IconCheck, IconCircle } from "@tabler/icons-react";

import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type TaskCardProps = {
  index: number;
  id: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  status: "pending" | "completed";
  onChangeTitle: (id: string, title: string) => void;
  onChangeDescription: (id: string, description: string) => void;
};

export function TaskCard({
  index,
  id,
  title,
  description,
  dueDate,
  status,
  onChangeTitle,
  onChangeDescription,
}: TaskCardProps) {
  const isCompleted = status === "completed";
  const formattedDate = formatDate(dueDate);

  return (
    <div
      className={cn(
        "rounded-xl border border-border/70 bg-card/80 p-4 shadow-sm transition-colors",
        isCompleted && "bg-primary/5 border-primary/20"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {index + 1}
          </span>
          <div className="flex-1">
            <Input
              variant="plain_text"
              defaultValue={title}
              className="w-full"
              onBlur={(e) => onChangeTitle?.(id, e.target.value)}
            />
            {formattedDate && (
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
            )}
          </div>
        </div>
        {isCompleted ? (
          <IconCheck className="size-4 text-primary" />
        ) : (
          <IconCircle className="size-4 text-muted-foreground" />
        )}
      </div>

      {description && (
        <Textarea
          variant="plain_text"
          className="mt-3 text-sm text-muted-foreground"
          defaultValue={description}
          onBlur={(e) => onChangeDescription?.(id, e.target.value)}
        />
      )}
    </div>
  );
}
