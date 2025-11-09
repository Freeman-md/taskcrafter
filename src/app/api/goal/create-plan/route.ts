import { GoalInputSchema } from "@/lib/schemas"
import { validateRequest } from "@/lib/validation"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const body = await request.json()
    const validation = validateRequest(GoalInputSchema, body)

    if (!validation.success) {
        return NextResponse.json(
            {
                error: "Validation failed",
                issues: validation.issues
            },
            { status: 400 }
        )
    }

    return NextResponse.json({
        message: "Request validated!",
        goal: validation.data
    })
}
