import type { StreamMessage } from "@/types"

export function createStreamHelpers<T>(controller: ReadableStreamDefaultController) {
  const encoder = new TextEncoder()

  return {
    send(msg: StreamMessage<T>) {
      controller.enqueue(encoder.encode(JSON.stringify(msg) + "\n"))
    },
  }
}
