// lib/recipes/create.ts

import { db } from '@/lib/db';
import { recipeSchema } from '@/lib/validations/recipe';
import type { Prisma } from '@prisma/client';

export interface CreateRecipeInput {
  userId: string;
  title: string;
  description?: string;
  servings?: number;
  prepTime?: number;
  cookTime?: number;
  isComplete?: boolean;
  isPublic?: boolean;
  ingredients: Array<{
    name: string;
    amount: number | null;
    unit: string;
    scalingRule?: 'linear' | 'logarithmic' | 'sqrt' | 'fixed';
  }>;
  instructions?: Array<{
    content: string;
    order: number;
  }>;
  images?: Array<{
    url: string;
    caption?: string;
    stepNumber?: number;
    order: number;
    isMain?: boolean;
  }>;
}

/**
 * Create a new recipe with ingredients and instructions
 */
export async function createRecipe(input: CreateRecipeInput) {
  try {
    // Validate input
    const validated = recipeSchema.parse({
      title: input.title,
      servings: input.servings || 1,
      ingredients: input.ingredients,
      instructions: input.instructions,
      prepTime: input.prepTime || 0,
      cookTime: input.cookTime || 0,
    });

    // Get or create ingredients
    const ingredientData = await Promise.all(
      input.ingredients.map(async (ing) => {
        const ingredient = await db.ingredient.upsert({
          where: { name: ing.name },
          update: {},
          create: {
            name: ing.name,
            category: 'other',
            scalingRule: ing.scalingRule || 'linear',
          },
        });
        return {
          ingredientId: ingredient.id,
          amount: ing.amount,
          unit: ing.unit,
        };
      })
    );

    // Create recipe with ingredients, instructions and images
    const recipe = await db.recipe.create({
      data: {
        userId: input.userId,
        title: validated.title,
        description: input.description,
        servings: validated.servings,
        prepTime: validated.prepTime,
        cookTime: validated.cookTime,
        totalTime: (validated.prepTime || 0) + (validated.cookTime || 0),
        isComplete: input.isComplete ?? true,
        isPublic: input.isPublic ?? false,
        
        // Create recipe ingredients
        recipeIngredients: {
          create: ingredientData.map((ing) => ({
            ingredientId: ing.ingredientId,
            amount: ing.amount,
            unit: ing.unit,
          })),
        },

        // Create instructions if provided
        instructions: input.instructions
          ? {
              create: input.instructions.map((inst) => ({
                stepNumber: inst.order,
                description: inst.content,
              })),
            }
          : undefined,

        // Create images if provided
        images: input.images
          ? {
              create: input.images.map((img) => ({
                url: img.url,
                caption: img.caption,
                stepNumber: img.stepNumber,
                order: img.order,
                isMain: img.isMain ?? false,
              })),
            }
          : undefined,
      },
      include: {
        recipeIngredients: {
          include: {
            ingredient: true,
          },
        },
        instructions: {
          orderBy: {
            stepNumber: 'asc',
          },
        },
        images: {
          orderBy: {
            order: 'asc',
          },
        },
        user: true,
      },
    });

    return recipe;
  } catch (error) {
    console.error('Error creating recipe:', error);
    throw error;
  }
}
