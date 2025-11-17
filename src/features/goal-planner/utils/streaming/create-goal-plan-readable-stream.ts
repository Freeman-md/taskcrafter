import { createStreamHelpers } from "@/lib/streaming/create-stream-helpers"
import { Stream } from "openai/core/streaming.mjs";
import { ResponseStreamEvent } from "openai/resources/responses/responses.mjs";
import { Goal } from "../../../../../prisma/generated/zod";


export const createGoalPlanReadableStream = (response: Stream<ResponseStreamEvent> & {
    _request_id?: string | null;
}) => {
    return new ReadableStream({
        async start(controller) {
            const { send } = createStreamHelpers<Goal>(controller)

            let finalText = ""

            for await (const event of response) {
                switch (event.type) {
                    case "response.in_progress":
                        send({
                            status: "thinking",
                            text: "Analyzing your goal..."
                        })
                        break

                    case "response.output_item.added":
                        if (event.item.type === "reasoning") {
                            send({
                                status: "reasoning",
                                text: "Thinking through your goal..."
                            })
                        } else if (event.item.type === "message") {
                            send({
                                status: "generating",
                                text: "Building task list..."
                            })
                        }
                        break
                    case "response.output_item.done":
                        if (event.item.type === "reasoning") {
                            send({
                                status: "reasoning_done",
                                text: "Finished internal reasoning...",
                            })
                        } else if (event.item.type === "message") {
                            send({
                                status: "summarizing",
                                text: "Wrapping up...",
                            })
                        }
                        break
                    case "response.output_text.done":
                        finalText = event.text
                        send({
                            status: "finalizing",
                            text: "Finalizing plan..."
                        })
                        break
                    case "response.completed":
                        let parsedPlan = null

                        try {
                            parsedPlan = JSON.parse(finalText)
                        } catch {
                            send({
                                status: "error",
                                text: "Could not parse generated plan.",
                            })
                        }

                        send({
                            status: "complete",
                            data: parsedPlan
                        })

                        break
                }
            }
        }
    })
}
