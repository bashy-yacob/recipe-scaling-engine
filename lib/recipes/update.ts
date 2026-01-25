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
  isPublic?: boolean;
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
      if (input.isPublic !== undefined) updateData.isPublic = input.isPublic;

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
        images: {
          orderBy: {
            order: 'asc',
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
        images: {
          orderBy: {
            order: 'asc',
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
        images: {
          orderBy: {
            order: 'asc',
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
 * Update recipe images
 */
export async function updateRecipeImages(
  recipeId: string,
  images: Array<{
    url: string;
    caption?: string;
    stepNumber?: number;
    order: number;
    isMain?: boolean;
  }>
) {
  try {
    // Delete existing images
    await db.recipeImage.deleteMany({
      where: { recipeId },
    });

    // Create new images
    const updatedRecipe = await db.recipe.update({
      where: { id: recipeId },
      data: {
        images: {
          create: images.map((img) => ({
            url: img.url,
            caption: img.caption,
            stepNumber: img.stepNumber,
            order: img.order,
            isMain: img.isMain ?? false,
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
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return updatedRecipe;
  } catch (error) {
    console.error('Error updating recipe images:', error);
    throw error;
  }
}

/**
 * Add a single image to a recipe
 */
export async function addRecipeImage(
  recipeId: string,
  image: {
    url: string;
    caption?: string;
    stepNumber?: number;
    isMain?: boolean;
  }
) {
  try {
    // Get the current highest order
    const lastImage = await db.recipeImage.findFirst({
      where: { recipeId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const newOrder = (lastImage?.order ?? -1) + 1;

    // If this is marked as main, unmark others
    if (image.isMain) {
      await db.recipeImage.updateMany({
        where: { recipeId },
        data: { isMain: false },
      });
    }

    const newImage = await db.recipeImage.create({
      data: {
        recipeId,
        url: image.url,
        caption: image.caption,
        stepNumber: image.stepNumber,
        order: newOrder,
        isMain: image.isMain ?? false,
      },
    });

    return newImage;
  } catch (error) {
    console.error('Error adding recipe image:', error);
    throw error;
  }
}

/**
 * Delete a recipe image
 */
export async function deleteRecipeImage(imageId: string) {
  try {
    const deleted = await db.recipeImage.delete({
      where: { id: imageId },
    });

    return deleted;
  } catch (error) {
    console.error('Error deleting recipe image:', error);
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
