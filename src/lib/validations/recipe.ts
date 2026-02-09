// src/lib/validations/recipe.ts

import { z } from 'zod';

export const ingredientSchema = z.object({
  name: z.string().min(1, 'שם המרכיב חובה'),
  amount: z.number().nullable().optional(), // null or undefined = not filled yet
  unit: z.string().min(1, 'יחידת מידה חובה'),
  scalingRule: z.enum(['linear', 'logarithmic', 'sqrt', 'fixed']).default('linear'),
});

export const instructionSchema = z.object({
  content: z.string().min(1, 'הוראה חובה'),
  order: z.number().int().nonnegative(),
});

export const imageSchema = z.object({
  url: z.string().url('כתובת URL לא תקינה'),
  caption: z.string().optional(),
  stepNumber: z.number().int().optional(),
  order: z.number().int().nonnegative(),
  isMain: z.boolean().default(false),
});

export const recipeSchema = z.object({
  title: z.string().min(1, 'שם המתכון חובה'),
  description: z.string().optional(),
  servings: z.number().int().positive('מספר המנות חייב להיות חיובי'),
  prepTime: z.number().int().nonnegative('זמן הכנה לא יכול להיות שלילי').optional(),
  cookTime: z.number().int().nonnegative('זמן בישול לא יכול להיות שלילי').optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  category: z.string().optional(),
  ingredients: z.array(ingredientSchema).min(1, 'צריך לפחות מרכיב אחד'),
  instructions: z.array(instructionSchema).optional().default([]),
  images: z.array(imageSchema).optional().default([]),
  isComplete: z.boolean().optional().default(true),
  isPublic: z.boolean().optional().default(false),
});

export const createRecipeSchema = recipeSchema;
export const updateRecipeSchema = recipeSchema.partial().omit({ title: true }).merge(
  z.object({ title: z.string().min(1, 'שם המתכון חובה').optional() })
);

export type Ingredient = z.infer<typeof ingredientSchema>;
export type Instruction = z.infer<typeof instructionSchema>;
export type RecipeImage = z.infer<typeof imageSchema>;
export type Recipe = z.infer<typeof recipeSchema>;
export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;
