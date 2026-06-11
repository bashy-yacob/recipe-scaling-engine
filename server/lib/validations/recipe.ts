// server/lib/validations/recipe.ts
// Zod schemas for recipe validation

import { z } from 'zod';

// ============================================
// Sub-schemas
// ============================================

export const ingredientInput = z.object({
  name: z.string().min(1, 'שם המרכיב חובה'),
  amount: z.number().nullable().optional(),
  unit: z.string().min(1, 'יחידת מידה חובה'),
  scalingRule: z.enum(['linear', 'logarithmic', 'sqrt', 'fixed']).default('linear'),
});

export const instructionInput = z.object({
  content: z.string().min(1, 'הוראה חובה'),
  order: z.number().int().nonnegative(),
});

export const imageInput = z.object({
  url: z.string().url('כתובת URL לא תקינה'),
  caption: z.string().optional(),
  stepNumber: z.number().int().optional(),
  order: z.number().int().nonnegative(),
  isMain: z.boolean().default(false),
});

// ============================================
// Main schemas
// ============================================

export const createRecipeSchema = z.object({
  title: z.string().min(1, 'שם המתכון חובה'),
  description: z.string().optional(),
  servings: z.number().int().positive('מספר המנות חייב להיות חיובי'),
  prepTime: z.number().int().nonnegative().optional(),
  cookTime: z.number().int().nonnegative().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  category: z.string().optional(),
  isComplete: z.boolean().optional().default(true),
  isPublic: z.boolean().optional().default(false),
  ingredients: z.array(ingredientInput).min(1, 'צריך לפחות מרכיב אחד'),
  instructions: z.array(instructionInput).optional().default([]),
  images: z.array(imageInput).optional().default([]),
});

export const updateRecipeSchema = createRecipeSchema.partial();

// ============================================
// TypeScript types
// ============================================

export type IngredientInput = z.infer<typeof ingredientInput>;
export type InstructionInput = z.infer<typeof instructionInput>;
export type ImageInput = z.infer<typeof imageInput>;
export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;
