import type { StreamMessage } from "@/types"

export function createStreamHelpers<T>(controller: ReadableStreamDefaultController) {
  const encoder = new TextEncoder()

  const send = (msg: StreamMessage<T>) => {
    controller.enqueue(encoder.encode(JSON.stringify(msg) + "\n"))
  }

  return {
    send,
  }
}
