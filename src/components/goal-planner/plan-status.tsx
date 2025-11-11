"use client"

import { IconListCheck, IconLoader2 } from "@tabler/icons-react"
import { useGoalPlanner } from "../providers/goal-planner-provider"

export function PlanStatus() {
  const { messages, errorMessage, isPending } = useGoalPlanner()

  const hasMessages = messages.length > 0

  return (
    <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-6 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <IconListCheck className="size-5 text-primary" />
        Plan preview
      </div>

      <div className="mt-3 text-sm text-muted-foreground/90">
        {renderContent({ isPending, hasMessages, messages, errorMessage })}
      </div>
    </div>
  )
}

type PlanStatusContentProps = {
  isPending: boolean
  hasMessages: boolean
  messages: { id: string; text: string }[]
  errorMessage: string | null
}

function renderContent({
  isPending,
  hasMessages,
  messages,
  errorMessage,
}: PlanStatusContentProps) {
  if (errorMessage) {
    return <ErrorState message={errorMessage} />
  }

  if (isPending && !hasMessages) {
    return <LoadingState />
  }

  if (hasMessages) {
    return <StreamingState messages={messages} isPending={isPending} />
  }

  return <EmptyState />
}

function EmptyState() {
  return (
    <p className="text-sm text-muted-foreground">
      Plan preview will appear here once you generate a goal.
    </p>
  )
}

function LoadingState() {
  return (
    <div className="flex items-center gap-3 text-muted-foreground">
      <IconLoader2 className="size-4 animate-spin text-primary" />
      <span>Generating your plan…</span>
    </div>
  )
}

function StreamingState({
  messages,
  isPending,
}: {
  messages: { id: string; text: string }[]
  isPending: boolean
}) {
  return (
    <div className="space-y-3">
      {isPending && (
        <p className="text-xs font-medium text-primary">Streaming live…</p>
      )}
      <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-border/60 bg-background/80 p-3 text-foreground shadow-inner">
        {messages.map((message) => (
          <p key={message.id} className="text-sm font-mono leading-relaxed">
            {message.text}
          </p>
        ))}
      </div>
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-destructive">
      {message}
    </div>
  )
}
