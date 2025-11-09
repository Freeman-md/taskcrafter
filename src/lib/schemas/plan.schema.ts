import z from 'zod'

export const GoalInputSchema = z.object({
    title: z.string(),
    deadline: z.coerce.date(),
    context: z.string().min(20)
})
