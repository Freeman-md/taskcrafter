"use client"

import { IconCheck, IconCircle } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

type TaskCardProps = {
  index: number
  title: string
  description?: string | null
  dueDate?: string | null
  status: "pending" | "completed"
}

export function TaskCard({
  index,
  title,
  description,
  dueDate,
  status,
}: TaskCardProps) {
  const isCompleted = status === "completed"
  const formattedDate = formatDate(dueDate)

  return (
    <div
      className={cn(
        "rounded-xl border border-border/70 bg-card/80 p-4 shadow-sm transition-colors",
        isCompleted && "bg-primary/5 border-primary/20",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {index + 1}
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">{title}</p>
            {formattedDate && (
              <p className="text-xs text-muted-foreground">Due {formattedDate}</p>
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
        <p className="mt-3 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

function formatDate(value?: string | null) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}
