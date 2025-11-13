import { Stream } from "openai/core/streaming.mjs";
import { ResponseStreamEvent } from "openai/resources/responses/responses.mjs";

export const createGoalPlanReadableStream = (response: Stream<ResponseStreamEvent> & {
    _request_id?: string | null;
}) => {
    return new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            try {
                let finalText = ''

                for await (const event of response) {
                    switch (event.type) {
                        case "response.in_progress":
                            console.log("response.in_progress")
                            controller.enqueue(
                                encoder.encode(
                                    JSON.stringify({
                                        status: 'thinking',
                                        message: 'Analysing your goal...'
                                    }) + "\n"
                                )
                            )
                            break;
                        case "response.output_item.added":
                            console.log("response.output_item.added", event.item.type)
                            if (event.item.type === "reasoning") {
                                controller.enqueue(
                                    encoder.encode(
                                        JSON.stringify({
                                            status: "reasoning",
                                            message: "Thinking through your goal...",
                                        }) + "\n"
                                    )
                                )
                            } else if (event.item.type === "message") {
                                controller.enqueue(
                                    encoder.encode(
                                        JSON.stringify({
                                            status: "generating",
                                            message: "Building task list...",
                                        }) + "\n"
                                    )
                                )
                            }
                            break;
                        case "response.output_text.done":
                            console.log("response.output_text.done")
                            finalText = event.text

                            controller.enqueue(
                                encoder.encode(
                                    JSON.stringify({
                                        status: 'finalizing',
                                        message: 'Finalizing plan...'
                                    }) + "\n"
                                )
                            )
                            break;
                        case "response.output_item.done":
                            console.log("response.output_item.done", event.item.type)
                            if (event.item.type === "reasoning") {
                                controller.enqueue(
                                    encoder.encode(
                                        JSON.stringify({
                                            status: "reasoning_done",
                                            message: "Finished internal reasoning...",
                                        }) + "\n"
                                    )
                                )
                            } else if (event.item.type === "message") {
                                controller.enqueue(
                                    encoder.encode(
                                        JSON.stringify({
                                            status: "summarizing",
                                            message: "Wrapping up...",
                                        }) + "\n"
                                    )
                                )
                            }
                            break

                        case "response.completed":
                            console.log("response.completed")
                            let parsedPlan = null

                            try {
                                parsedPlan = JSON.parse(finalText)
                            } catch (err) {
                                console.error("Failed to parse final plan:", err, finalText)
                                controller.enqueue(
                                    encoder.encode(
                                        JSON.stringify({
                                            status: "error",
                                            message: "Could not parse generated plan.",
                                        }) + "\n"
                                    )
                                )
                                break
                            }

                            controller.enqueue(
                                encoder.encode(
                                    JSON.stringify({
                                        status: "complete",
                                        plan: parsedPlan,
                                    }) + "\n"
                                )
                            )
                            break

                        default:
                            break;
                    }
                }
            } catch (err) {
                controller.error(err);
            } finally {
                controller.close();
            }
        }
    });
}