// lib/recipes/update.ts

import { db } from '@/lib/db';

export interface UpdateRecipeInput {
  title?: string;
  description?: string;
  servings?: number;
  prepTime?: number;
  cookTime?: number;
  rating?: number;
  notes?: string;
  isComplete?: boolean;
}

/**
 * Update recipe basic info
 */
export async function updateRecipe(recipeId: string, input: UpdateRecipeInput) {
  try {
    const updateData: any = {};

    if (input.title) updateData.title = input.title;
    if (input.description) updateData.description = input.description;
    if (input.servings) updateData.servings = input.servings;
    if (input.prepTime !== undefined) updateData.prepTime = input.prepTime;
    if (input.cookTime !== undefined) updateData.cookTime = input.cookTime;
    if (input.rating !== undefined) updateData.rating = input.rating;
    if (input.notes) updateData.notes = input.notes;
    if (input.isComplete !== undefined) updateData.isComplete = input.isComplete;

    // Calculate total time if prep or cook time changed
    if (input.prepTime !== undefined || input.cookTime !== undefined) {
      const recipe = await db.recipe.findUnique({
        where: { id: recipeId },
        select: { prepTime: true, cookTime: true },
      });

      const prepTime = input.prepTime !== undefined ? input.prepTime : recipe?.prepTime || 0;
      const cookTime = input.cookTime !== undefined ? input.cookTime : recipe?.cookTime || 0;
      updateData.totalTime = prepTime + cookTime;
    }

    updateData.updatedAt = new Date();

    const recipe = await db.recipe.update({
      where: { id: recipeId },
      data: updateData,
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
      },
    });

    return recipe;
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw error;
  }
}

/**
 * Update recipe ingredients
 */
export async function updateRecipeIngredients(
  recipeId: string,
  ingredients: Array<{
    name: string;
    amount: number | null;
    unit: string;
    scalingRule?: string;
  }>
) {
  try {
    // Delete existing ingredients
    await db.recipeIngredient.deleteMany({
      where: { recipeId },
    });

    // Get or create ingredients
    const ingredientData = await Promise.all(
      ingredients.map(async (ing) => {
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

    // Create new recipe ingredients
    const updatedRecipe = await db.recipe.update({
      where: { id: recipeId },
      data: {
        recipeIngredients: {
          create: ingredientData.map((ing) => ({
            ingredientId: ing.ingredientId,
            amount: ing.amount,
            unit: ing.unit,
          })),
        },
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
      },
    });

    return updatedRecipe;
  } catch (error) {
    console.error('Error updating recipe ingredients:', error);
    throw error;
  }
}

/**
 * Update recipe instructions
 */
export async function updateRecipeInstructions(
  recipeId: string,
  instructions: Array<{
    content: string;
    order: number;
  }>
) {
  try {
    // Delete existing instructions
    await db.instruction.deleteMany({
      where: { recipeId },
    });

    // Create new instructions
    const updatedRecipe = await db.recipe.update({
      where: { id: recipeId },
      data: {
        instructions: {
          create: instructions.map((inst) => ({
            stepNumber: inst.order,
            description: inst.content,
          })),
        },
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
      },
    });

    return updatedRecipe;
  } catch (error) {
    console.error('Error updating recipe instructions:', error);
    throw error;
  }
}

/**
 * Mark recipe as cooked
 */
export async function markRecipeAsCooked(recipeId: string) {
  try {
    const recipe = await db.recipe.update({
      where: { id: recipeId },
      data: {
        timesCooked: {
          increment: 1,
        },
        lastCookedAt: new Date(),
      },
    });

    return recipe;
  } catch (error) {
    console.error('Error marking recipe as cooked:', error);
    throw error;
  }
}
