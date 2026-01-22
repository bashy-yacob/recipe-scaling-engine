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
  ingredients: Array<{
    name: string;
    amount: number;
    unit: string;
    scalingRule?: 'linear' | 'logarithmic' | 'sqrt' | 'fixed';
  }>;
  instructions?: Array<{
    content: string;
    order: number;
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

    // Create recipe with ingredients and instructions
    const recipe = await db.recipe.create({
      data: {
        userId: input.userId,
        title: validated.title,
        description: input.description,
        servings: validated.servings,
        prepTime: validated.prepTime,
        cookTime: validated.cookTime,
        totalTime: (validated.prepTime || 0) + (validated.cookTime || 0),
        
        // Create recipe ingredients
        recipeIngredients: {
          create: ingredientData.map((ing, index) => ({
            ingredientId: ing.ingredientId,
            amount: ing.amount,
            unit: ing.unit,
            order: index,
          })),
        },

        // Create instructions if provided
        instructions: input.instructions
          ? {
              create: input.instructions.map((inst) => ({
                content: inst.content,
                order: inst.order,
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
