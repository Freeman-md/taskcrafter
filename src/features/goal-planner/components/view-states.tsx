import { StreamMessage } from "@/types";
import { IconLoader2, IconMoodEmpty } from "@tabler/icons-react";
import { GoalWithTasks } from "../types";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export function StreamingState({
  streamMessages,
  isGeneratingTasks,
}: {
  streamMessages: StreamMessage<GoalWithTasks>[];
  isGeneratingTasks: boolean;
}) {
  const latestMessage = streamMessages
    .filter((message) => message.status !== "complete")
    .at(-1); // last message

  return (
    <div className="space-y-3">
      {isGeneratingTasks && (
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

export function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
      <span className="bg-muted/60 text-muted-foreground flex size-12 items-center justify-center rounded-xl">
        <IconMoodEmpty className="size-6" />
      </span>
      <div className="space-y-1">
        <p>
          Plan preview will appear here once you generate a goal.
        </p>
      </div>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="flex items-center gap-3 text-muted-foreground">
      <IconLoader2 className="size-4 animate-spin text-primary" />
      <span>Generating your goal plan…</span>
    </div>
  );
}


export function ErrorState({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>{message}</AlertTitle>
    </Alert>
  );
}

