import { NextResponse } from "next/server"
import type { ValidationIssue } from "@/lib/validation/validateRequest"

type ApiErrorInit = {
    message: string
    status?: number
    code?: string
    details?: Record<string, unknown>
}

type RouteHandler = (request: Request) => Promise<Response> | Response

const handleApiError = (error: unknown) => {
    if (error instanceof ApiError) {
        return NextResponse.json(
            {
                error: error.code,
                message: error.message,
                ...(error.details ? { details: error.details } : {})
            },
            { status: error.status }
        )
    }

    console.error("Unhandled API error:", error)

    return NextResponse.json(
        {
            error: "INTERNAL_SERVER_ERROR",
            message: "Something unexpected happened. Please try again."
        },
        { status: 500 }
    )
}

export class ApiError extends Error {
    status: number
    code: string
    details?: Record<string, unknown>

    constructor({ message, status = 500, code = "INTERNAL_SERVER_ERROR", details }: ApiErrorInit) {
        super(message)
        this.status = status
        this.code = code
        this.details = details
    }
}

export class ValidationApiError extends ApiError {
    issues: ValidationIssue[]

    constructor(issues: ValidationIssue[], message = "Validation failed") {
        super({
            message,
            status: 400,
            code: "VALIDATION_ERROR",
            details: { issues }
        })
        this.issues = issues
    }
}

export function withApiErrorHandling(handler: RouteHandler): RouteHandler {
    return async (request: Request) => {
        try {
            return await handler(request)
        } catch (error) {
            return handleApiError(error)
        }
    }
}
