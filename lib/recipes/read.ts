// lib/recipes/read.ts

import { db } from '@/lib/db';

/**
 * Get all recipes for a user
 */
export async function getUserRecipes(userId: string) {
  try {
    const recipes = await db.recipe.findMany({
      where: { userId },
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
      orderBy: {
        createdAt: 'desc',
      },
    });
    return recipes;
  } catch (error) {
    console.error('Error fetching user recipes:', error);
    throw error;
  }
}

/**
 * Get a single recipe by ID
 */
export async function getRecipeById(recipeId: string, viewerId?: string) {
  try {
    const whereClause = viewerId
      ? {
          id: recipeId,
          OR: [{ isPublic: true }, { userId: viewerId }],
        }
      : { id: recipeId, isPublic: true };

    const recipe = await db.recipe.findFirst({
      where: whereClause,
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
    console.error('Error fetching recipe:', error);
    throw error;
  }
}

/**
 * Get recipes by tags
 */
export async function getRecipesByTag(userId: string, tagName: string) {
  try {
    const recipes = await db.recipe.findMany({
      where: {
        OR: [
          { isPublic: true },
          { userId },
        ],
        tags: {
          some: {
            tag: {
              name: tagName,
            },
          },
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
        images: {
          orderBy: {
            order: 'asc',
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return recipes;
  } catch (error) {
    console.error('Error fetching recipes by tag:', error);
    throw error;
  }
}

/**
 * Search recipes
 */
export async function searchRecipes(userId: string, query: string) {
  try {
    const recipes = await db.recipe.findMany({
      where: {
        OR: [
          { isPublic: true },
          { userId },
        ],
        AND: [
          {
            OR: [
              { title: { contains: query } },
              { description: { contains: query } },
            ],
          },
        ],
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
      orderBy: {
        createdAt: 'desc',
      },
    });
    return recipes;
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
}

/**
 * Get recipe count for a user
 */
export async function getRecipeCount(userId: string) {
  try {
    const count = await db.recipe.count({
      where: { userId },
    });
    return count;
  } catch (error) {
    console.error('Error fetching recipe count:', error);
    throw error;
  }
}
