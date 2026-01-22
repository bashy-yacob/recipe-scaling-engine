// app/api/recipes/route.ts

import { db } from '@/lib/db';
import { createRecipe } from '@/lib/recipes/create';
import { getUserRecipes } from '@/lib/recipes/read';

export async function GET(request: Request) {
  try {
    // For now, we'll use a hardcoded user ID from the seed
    const userId = 'demo-user-from-seed'; // We'll fetch the actual user ID
    
    // Get the first user (demo user)
    const user = await db.user.findFirst();
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const recipes = await getUserRecipes(user.id);
    return Response.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return Response.json({ error: 'Failed to fetch recipes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Get the first user (demo user)
    const user = await db.user.findFirst();
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const recipe = await createRecipe({
      userId: user.id,
      ...body,
    });

    return Response.json(recipe, { status: 201 });
  } catch (error) {
    console.error('Error creating recipe:', error);
    const message = error instanceof Error ? error.message : 'Failed to create recipe';
    return Response.json({ error: message }, { status: 500 });
  }
}
