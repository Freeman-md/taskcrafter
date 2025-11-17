import 'server-only'

import { openai } from "@/lib/openai"
import { zodTextFormat } from "openai/helpers/zod.mjs"

import { GoalInput } from "../types"
import { createGoalPlanReadableStream } from "../utils/streaming/create-goal-plan-readable-stream"
import { buildGoalPlanMessages } from '../utils/streaming/prompt-generators'
import { AIGoalOutputSchema } from '../schemas/ai-schema'

export async function createGoalPlan(input: GoalInput) {
    const messages = buildGoalPlanMessages(input)

    const response = await openai.responses.create({
        model: "gpt-5-mini",
        input: messages,
        text: { format: zodTextFormat(AIGoalOutputSchema, "plan") },
        stream: true,
    })

    return await createGoalPlanReadableStream(response)
} 