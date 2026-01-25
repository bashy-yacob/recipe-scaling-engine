// app/api/recipes/route.ts

import { db } from '@/lib/db';
import { createRecipe } from '@/lib/recipes/create';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    // Return recipes that are public or belong to the current user
    const recipes = await db.recipe.findMany({
      where: userId
        ? { OR: [{ isPublic: true }, { userId }] }
        : { isPublic: true },
      include: {
        recipeIngredients: { include: { ingredient: true } },
        instructions: { orderBy: { stepNumber: 'asc' } },
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return Response.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return Response.json({ error: 'Failed to fetch recipes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'לא מחובר' }, { status: 401 });
    }

    const body = await request.json();

    const recipe = await createRecipe({
      userId: session.user.id,
      ...body,
    });

    return Response.json(recipe, { status: 201 });
  } catch (error) {
    console.error('Error creating recipe:', error);
    const message = error instanceof Error ? error.message : 'Failed to create recipe';
    return Response.json({ error: message }, { status: 500 });
  }
}
