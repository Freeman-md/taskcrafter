import { ValidationIssue } from "@/types";
import { ZodIssue } from "zod/v3";

export function buildFieldErrorsFromZod(issues: ZodIssue[]): ValidationIssue[] {
    return issues.map((issue) => ({
        field: issue.path?.[0] ?? "unknown",
        message: issue.message ?? "Invalid input",
    } as ValidationIssue))
}