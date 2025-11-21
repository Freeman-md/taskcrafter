import { StreamMessage } from "@/types/stream"; 

type StreamingStateProps<T> = {
  streamMessages: StreamMessage<T>[];
  isGeneratingTasks: boolean;
};

export default function StreamingState<T>({
  streamMessages,
  isGeneratingTasks,
}: StreamingStateProps<T>) {
  const latestMessage = streamMessages
    .filter((message) => message.status !== "complete")
    .at(-1);

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