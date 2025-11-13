import { ValidationIssue, ValidationResult } from "@/types"
import z from "zod"

export function buildFieldErrorsFromZod(issues: any[]): ValidationIssue[] {
  return issues.map((issue) => ({
    field: issue.path?.[0] ?? "unknown",
    message: issue.message ?? "Invalid input",
  }))
}

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
