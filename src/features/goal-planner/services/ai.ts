import 'server-only'

import { openai } from "@/lib/openai"
import { buildGoalPlanMessages } from "../utils/prompt-generators"
import { GoalInput } from "../types"
import { zodTextFormat } from "openai/helpers/zod.mjs"
import { GoalOutputSchema } from "../goal.schema"
import { createGoalPlanReadableStream } from "../utils/stream-generators"

export async function createGoalPlan(input: GoalInput) {
    const messages = buildGoalPlanMessages(input)

    const response = await openai.responses.create({
        model: "gpt-5-mini",
        input: messages,
        text: { format: zodTextFormat(GoalOutputSchema, "plan") },
        stream: true,
    })

    return await createGoalPlanReadableStream(response)
}