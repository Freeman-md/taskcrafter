import z from "zod"

export type ValidationIssue = {
    field: string
    message: string
}

export type ValidationResult<T> =
    | { success: true; data: T }
    | { success: false; issues: ValidationIssue[] }

export function validateRequest<T>(
    schema: z.ZodType<T>,
    data: unknown
): ValidationResult<T> {
    const result = schema.safeParse(data)

    if (!result.success) {
        const issues = result.error.issues.map((issue) => ({
            field: issue.path.join(".") || "root",
            message: issue.message
        }))

        return {
            success: false,
            issues
        }
    }

    return { success: true, data: result.data }
}
