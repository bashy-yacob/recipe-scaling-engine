// app/api/recipes/[id]/like/route.ts

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    // Get like count
    const likeCount = await db.recipeLike.count({
      where: { recipeId: id },
    });

    // Check if current user liked
    let isLiked = false;
    if (session?.user?.id) {
      const like = await db.recipeLike.findUnique({
        where: {
          userId_recipeId: {
            userId: session.user.id,
            recipeId: id,
          },
        },
      });
      isLiked = !!like;
    }

    return Response.json({ likeCount, isLiked });
  } catch (error) {
    console.error('Error getting likes:', error);
    return Response.json({ error: 'Failed to get likes' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    
    if (!session?.user?.id) {
      return Response.json({ error: 'לא מחובר' }, { status: 401 });
    }

    // Check if recipe exists and is public
    const recipe = await db.recipe.findUnique({
      where: { id },
      select: { isPublic: true, userId: true },
    });

    if (!recipe) {
      return Response.json({ error: 'מתכון לא נמצא' }, { status: 404 });
    }

    if (!recipe.isPublic && recipe.userId !== session.user.id) {
      return Response.json({ error: 'אין גישה למתכון זה' }, { status: 403 });
    }

    // Toggle like
    const existingLike = await db.recipeLike.findUnique({
      where: {
        userId_recipeId: {
          userId: session.user.id,
          recipeId: id,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await db.recipeLike.delete({
        where: { id: existingLike.id },
      });
      
      const likeCount = await db.recipeLike.count({
        where: { recipeId: id },
      });
      
      return Response.json({ liked: false, likeCount });
    } else {
      // Like
      await db.recipeLike.create({
        data: {
          userId: session.user.id,
          recipeId: id,
        },
      });
      
      const likeCount = await db.recipeLike.count({
        where: { recipeId: id },
      });
      
      return Response.json({ liked: true, likeCount });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return Response.json({ error: 'Failed to toggle like' }, { status: 500 });
  }
}
