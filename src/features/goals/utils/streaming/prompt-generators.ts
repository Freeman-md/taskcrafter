import { ResponseInput } from "openai/resources/responses/responses.mjs";
import { GoalInput } from "../../types";

export function buildGoalPlanMessages(input: GoalInput): ResponseInput {
    return [
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

                        Title: ${input.title}
                        ${input.deadline ? `Deadline: ${input.deadline}` : ""}
                        ${input.context ? `Context: ${input.context}` : ""}

                        Return only structured data following the schema.`
        }
    ]
}