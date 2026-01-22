// app/api/recipes/[id]/route.ts

import { db } from '@/lib/db';
import { getRecipeById } from '@/lib/recipes/read';
import { updateRecipe, updateRecipeIngredients, updateRecipeInstructions } from '@/lib/recipes/update';
import { deleteRecipe } from '@/lib/recipes/delete';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const recipe = await getRecipeById(id);

    if (!recipe) {
      return Response.json({ error: 'Recipe not found' }, { status: 404 });
    }

    return Response.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return Response.json({ error: 'Failed to fetch recipe' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Update basic recipe info
    let recipe = await updateRecipe(id, {
      title: body.title,
      description: body.description,
      servings: body.servings,
      prepTime: body.prepTime,
      cookTime: body.cookTime,
      isComplete: body.isComplete,
    });

    // Update ingredients if provided
    if (body.ingredients && Array.isArray(body.ingredients)) {
      recipe = await updateRecipeIngredients(id, body.ingredients);
    }

    // Update instructions if provided
    if (body.instructions && Array.isArray(body.instructions)) {
      recipe = await updateRecipeInstructions(id, body.instructions);
    }

    return Response.json(recipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    return Response.json({ error: 'Failed to update recipe' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteRecipe(id);

    return Response.json({ message: 'Recipe deleted' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return Response.json({ error: 'Failed to delete recipe' }, { status: 500 });
  }
}
