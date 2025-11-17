import { FieldErrors, ValidationIssue } from "@/types"



export function formatErrors<T>(issues: ValidationIssue[]): FieldErrors<T> {
    return issues.reduce((errors, issue) => {
        const field = issue.field as keyof T

        if (field) {
            errors[field] = issue.message
        }

        return errors
    }, {} as FieldErrors<T>)
}
