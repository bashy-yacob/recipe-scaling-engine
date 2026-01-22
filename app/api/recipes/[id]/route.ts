// app/api/recipes/[id]/route.ts

import { db } from '@/lib/db';
import { getRecipeById } from '@/lib/recipes/read';
import { updateRecipe } from '@/lib/recipes/update';
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

    const recipe = await updateRecipe(id, body);
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
