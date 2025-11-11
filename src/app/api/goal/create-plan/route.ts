import { withApiErrorHandling, ValidationApiError } from "@/lib/api"
import { openai } from "@/lib/openai"
import { GoalInputSchema, PlanOutputSchema } from "@/lib/schemas"
import { validateRequest } from "@/lib/validation"
import { zodTextFormat } from "openai/helpers/zod";


export const POST = withApiErrorHandling(async (request: Request) => {
    const body = await request.json()
    const validation = validateRequest(GoalInputSchema, body)

    if (!validation.success) {
        throw new ValidationApiError(validation.issues)
    }

    const response = await openai.responses
        .create({
            model: 'gpt-5-mini',
            input: [
                {
                    role: 'system',
                    content: `You are TaskCrafter, an AI planning assistant.
                            You take a user's goal and generate a structured plan consisting of tasks.
                            Each task must have a clear title, concise description, and optional due date.
                            Respond strictly in JSON format that matches the provided schema.`
                },
                {
                    role: 'user',
                    content: `Generate a detailed plan for this goal:

                        Title: ${validation.data.title}
                        ${validation.data.deadline ? `Deadline: ${validation.data.deadline}` : ""}
                        ${validation.data.context ? `Context: ${validation.data.context}` : ""}

                        Return only structured data following the schema.`
                }
            ],
            text: {
                format: zodTextFormat(PlanOutputSchema, "plan")
            },
            stream: true
        });

    const stream = new ReadableStream({
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

    return new Response(stream, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache",
        },
    });
})
