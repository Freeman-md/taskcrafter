import z from 'zod'

export const GoalInputSchema = z.object({
  title: z
    .string({
      error: "Goal title is required.",
    })
    .min(1, "Goal title cannot be empty."),

  deadline: z
    .string()
    .optional()
    .refine(
      (value) => !value || !isNaN(Date.parse(value)),
      "Please enter a valid date."
    ),

  context: z
    .string()
    .optional()
    .refine(
      (value) => !value || value.length >= 20,
      "Context must be at least 20 characters long if provided."
    ),
})

export const TaskSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable().optional(),
    dueDate: z.iso.datetime().nullable().optional(),
    status: z.enum(['pending', 'completed'])
})

export const GoalOutputSchema = z.object({
    title: z.string(),
    summary: z.string(),
    deadline: z.string(),
    tasks: z.array(TaskSchema)
})