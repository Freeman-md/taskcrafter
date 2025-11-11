import z from 'zod'

export const GoalInputSchema = z.object({
    title: z.string(),
    deadline: z.coerce.date().optional(),
    context: z.string().min(20).optional()
})

export const TaskSchema = z.object({
    title: z.string(),
    description: z.string().nullable().optional(),
    dueDate: z.iso.datetime().nullable().optional(),
    status: z.enum(['pending', 'completed'])
})

export const PlanOutputSchema = z.object({
    goalTitle: z.string(),
    summary: z.string(),
    tasks: z.array(TaskSchema)
})