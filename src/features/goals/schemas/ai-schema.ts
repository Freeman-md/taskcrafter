import z from 'zod'
import { GoalSchema, TaskSchema } from '../../../../prisma/generated/zod';

export const AIGoalInputSchema = z.object({
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

export const AITaskSchema = TaskSchema.pick({
  title: true,
  description: true,
  deadline: true,
  status: true,
}).extend({
  deadline: z.string().nullable()
});

export const AIGoalOutputSchema = GoalSchema.pick({
  title: true,
  summary: true,
  deadline: true,
}).extend({
  deadline: z.string().nullable(),
  tasks: z.array(AITaskSchema),
});