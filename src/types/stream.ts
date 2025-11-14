export type StreamStatus =
  | "thinking"
  | "reasoning"
  | "generating"
  | "finalizing"
  | "complete"
  | (string & {}) 

export type StreamMessage<T> = {
  status: StreamStatus
  text?: string
  data?: T
}
