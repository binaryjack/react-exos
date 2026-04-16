import { z } from 'zod'

export const QuestionSchema = z.object({
  technologyId: z.string().uuid(),
  level: z.string().min(1).max(32),
  topic: z.string().min(1).max(128),
  subtopic: z.string().max(128).optional().default(''),
  type: z.enum(['mcq', 'coding']),
  prompt: z.string().min(1),
  options: z.array(z.string()).nullable().optional(),
  answer: z.string().min(1),
  difficulty: z.number().int().min(1).max(5),
  estimatedTime: z.number().int().min(10),
  explanation: z.string().optional().default(''),
  references: z.array(z.string()).optional().default([])
})

export type QuestionInput = z.infer<typeof QuestionSchema>
