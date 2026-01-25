// app/api/recipes/[id]/route.ts

import { db } from '@/lib/db';
import { getRecipeById } from '@/lib/recipes/read';
import { updateRecipe, updateRecipeIngredients, updateRecipeInstructions, updateRecipeImages } from '@/lib/recipes/update';
import { deleteRecipe } from '@/lib/recipes/delete';
import { auth } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    const viewerId = session?.user?.id;

    const recipe = await getRecipeById(id, viewerId);

    if (!recipe) {
      return Response.json({ error: 'מתכון לא נמצא או לא נגיש' }, { status: 404 });
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
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'לא מחובר' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const existing = await db.recipe.findUnique({ where: { id } });
    if (!existing) return Response.json({ error: 'מתכון לא נמצא' }, { status: 404 });
    if (existing.userId !== session.user.id) return Response.json({ error: 'אין הרשאה' }, { status: 403 });

    // Update basic recipe info
    let recipe = await updateRecipe(id, {
      title: body.title,
      description: body.description,
      servings: body.servings,
      prepTime: body.prepTime,
      cookTime: body.cookTime,
      isComplete: body.isComplete,
      isPublic: body.isPublic,
    });

    // Update ingredients if provided
    if (body.ingredients && Array.isArray(body.ingredients)) {
      recipe = await updateRecipeIngredients(id, body.ingredients);
    }

    // Update instructions if provided
    if (body.instructions && Array.isArray(body.instructions)) {
      recipe = await updateRecipeInstructions(id, body.instructions);
    }

    // Update images if provided
    if (body.images && Array.isArray(body.images)) {
      recipe = await updateRecipeImages(id, body.images);
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
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'לא מחובר' }, { status: 401 });
    }

    const { id } = await params;

    const existing = await db.recipe.findUnique({ where: { id } });
    if (!existing) return Response.json({ error: 'מתכון לא נמצא' }, { status: 404 });
    if (existing.userId !== session.user.id) return Response.json({ error: 'אין הרשאה' }, { status: 403 });

    await deleteRecipe(id);

    return Response.json({ message: 'Recipe deleted' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return Response.json({ error: 'Failed to delete recipe' }, { status: 500 });
  }
}
