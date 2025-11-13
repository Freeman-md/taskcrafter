import { createGoalPlan, GoalInputSchema } from "@/features/goal-planner";
import { withApiErrorHandling, ValidationApiError } from "@/lib/api"
import { validateRequest } from "@/lib/validation"


export const POST = withApiErrorHandling(async (request: Request) => {
    const body = await request.json()
    const validation = validateRequest(GoalInputSchema, body)

    if (!validation.success) {
        throw new ValidationApiError(validation.issues)
    }

    const stream = await createGoalPlan(validation.data);

    return new Response(stream, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache",
        },
    });
})
