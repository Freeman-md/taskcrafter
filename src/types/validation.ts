export type FieldErrors<T> = Partial<Record<keyof T, string>>

export type ValidationIssue = {
  field: string
  message: string
}

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; issues: ValidationIssue[] }

export type ValidationErrorResponse = {
  error: string
  message?: string
  details?: {
    issues: ValidationIssue[]
  }
}

export type ApiErrorResponse =
  | ValidationErrorResponse
  | {
    error: string
    message: string
    details?: Record<string, unknown>
  }