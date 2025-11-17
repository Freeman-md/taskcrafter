export const normalizeDate = (value: string | Date | null | undefined): Date | null => {
  if (!value) return null

  const parsed = value instanceof Date ? value : new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}
