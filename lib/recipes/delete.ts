// lib/recipes/delete.ts

import { db } from '@/lib/db';

/**
 * Delete a recipe and all related data
 */
export async function deleteRecipe(recipeId: string) {
  try {
    // Prisma will cascade delete related records due to onDelete: Cascade
    const recipe = await db.recipe.delete({
      where: { id: recipeId },
    });

    return recipe;
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
}

/**
 * Delete multiple recipes
 */
export async function deleteRecipes(recipeIds: string[]) {
  try {
    const result = await db.recipe.deleteMany({
      where: {
        id: {
          in: recipeIds,
        },
      },
    });

    return result;
  } catch (error) {
    console.error('Error deleting recipes:', error);
    throw error;
  }
}

/**
 * Delete all recipes for a user (use with caution!)
 */
export async function deleteAllUserRecipes(userId: string) {
  try {
    const result = await db.recipe.deleteMany({
      where: { userId },
    });

    return result;
  } catch (error) {
    console.error('Error deleting all user recipes:', error);
    throw error;
  }
}
