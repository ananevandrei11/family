import { z } from 'zod';

export const ExpenseSchema = z.object({
  expense: z.number().min(1),
  category: z.string(),
  date: z.string().datetime(),
  comments: z.string().nullable().optional(),
});

export type ExpenseSchemaType = z.infer<typeof ExpenseSchema>;