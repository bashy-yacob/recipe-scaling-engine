// lib/validations/recipe.ts

import { z } from 'zod';

export const ingredientSchema = z.object({
  name: z.string().min(1, 'שם המרכיב חובה'),
  amount: z.number().positive('כמות חייבת להיות חיובית'),
  unit: z.string().min(1, 'יחידת מידה חובה'),
  scalingRule: z.enum(['linear', 'logarithmic', 'sqrt', 'fixed'], {
    errorMap: () => ({ message: 'סוג scaling לא תקין' }),
  }),
});

export const instructionSchema = z.object({
  content: z.string().min(1, 'הוראה חובה'),
  order: z.number().int().positive(),
});

export const recipeSchema = z.object({
  title: z.string().min(1, 'שם המתכון חובה'),
  servings: z.number().int().positive('מספר המנות חייב להיות חיובי'),
  prepTime: z.number().int().nonnegative('זמן הכנה לא יכול להיות שלילי').optional(),
  cookTime: z.number().int().nonnegative('זמן בישול לא יכול להיות שלילי').optional(),
  ingredients: z.array(ingredientSchema).min(1, 'צריך לפחות מרכיב אחד'),
  instructions: z.array(instructionSchema).optional(),
});

export type Ingredient = z.infer<typeof ingredientSchema>;
export type Instruction = z.infer<typeof instructionSchema>;
export type Recipe = z.infer<typeof recipeSchema>;
