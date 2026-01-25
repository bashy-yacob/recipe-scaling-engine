// app/api/recipes/route.ts

import { db } from '@/lib/db';
import { createRecipe } from '@/lib/recipes/create';
import { auth } from '@/lib/auth';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    
    // Parse query params for filtering and sorting
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const difficulty = searchParams.get('difficulty');
    const category = searchParams.get('category');
    const maxPrepTime = searchParams.get('maxPrepTime');
    const maxCookTime = searchParams.get('maxCookTime');
    const minServings = searchParams.get('minServings');
    const maxServings = searchParams.get('maxServings');
    const search = searchParams.get('search');

    // Build where clause
    const where: Prisma.RecipeWhereInput = userId
      ? { OR: [{ isPublic: true }, { userId }] }
      : { isPublic: true };

    // Add filters
    if (difficulty) {
      where.difficulty = difficulty;
    }
    if (category) {
      where.category = category;
    }
    if (maxPrepTime) {
      where.prepTime = { lte: parseInt(maxPrepTime) };
    }
    if (maxCookTime) {
      where.cookTime = { lte: parseInt(maxCookTime) };
    }
    if (minServings || maxServings) {
      where.servings = {};
      if (minServings) where.servings.gte = parseInt(minServings);
      if (maxServings) where.servings.lte = parseInt(maxServings);
    }
    if (search) {
      where.AND = [
        where.OR ? { OR: where.OR } : {},
        {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        },
      ];
      delete where.OR;
    }

    // Build orderBy
    type SortableFields = 'createdAt' | 'title' | 'prepTime' | 'cookTime' | 'servings';
    const validSortFields: SortableFields[] = ['createdAt', 'title', 'prepTime', 'cookTime', 'servings'];
    const sortField = validSortFields.includes(sortBy as SortableFields) ? sortBy as SortableFields : 'createdAt';
    const orderBy: Prisma.RecipeOrderByWithRelationInput = { [sortField]: sortOrder === 'asc' ? 'asc' : 'desc' };

    // Return recipes that are public or belong to the current user
    const recipes = await db.recipe.findMany({
      where,
      include: {
        recipeIngredients: { include: { ingredient: true } },
        instructions: { orderBy: { stepNumber: 'asc' } },
        images: { orderBy: { order: 'asc' } },
        user: { select: { id: true, name: true } },
        _count: { select: { likes: true } },
      },
      orderBy,
    });

    // Add isLiked for current user
    let likedRecipeIds: Set<string> = new Set();
    if (userId) {
      const userLikes = await db.recipeLike.findMany({
        where: { userId },
        select: { recipeId: true },
      });
      likedRecipeIds = new Set(userLikes.map(l => l.recipeId));
    }

    const recipesWithLikes = recipes.map(recipe => ({
      ...recipe,
      likeCount: recipe._count.likes,
      isLiked: likedRecipeIds.has(recipe.id),
    }));

    // Sort by likes if requested (after fetch since it's a count)
    if (sortBy === 'likes') {
      recipesWithLikes.sort((a, b) => 
        sortOrder === 'desc' ? b.likeCount - a.likeCount : a.likeCount - b.likeCount
      );
    }

    return Response.json(recipesWithLikes);
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
