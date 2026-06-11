import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { AppError } from '../middleware/errors.js';
import { createRecipeSchema, updateRecipeSchema } from '../lib/validations/index.js';

const router = Router();

// ============================================
// GET /api/recipes — List recipes with filters
// ============================================

router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { search, sortBy, sortOrder, difficulty, category, maxPrepTime, maxCookTime } = req.query;

    const where: Record<string, unknown> = {};

    // Public recipes + user's own recipes
    if (req.user) {
      where.OR = [
        { isPublic: true },
        { userId: req.user.userId },
      ];
    } else {
      where.isPublic = true;
    }

    if (search) {
      where.title = { contains: String(search), mode: 'insensitive' };
    }
    if (difficulty) {
      where.difficulty = String(difficulty);
    }
    if (category) {
      where.category = String(category);
    }
    if (maxPrepTime) {
      where.prepTime = { lte: Number(maxPrepTime) };
    }
    if (maxCookTime) {
      where.cookTime = { lte: Number(maxCookTime) };
    }

    // Sorting
    const orderBy: Record<string, string> = {};
    const sortField = String(sortBy || 'createdAt');
    orderBy[sortField] = String(sortOrder || 'desc');

    const recipes = await prisma.recipe.findMany({
      where,
      orderBy,
      include: {
        user: { select: { id: true, name: true, email: true } },
        recipeIngredients: {
          include: { ingredient: { select: { name: true } } },
        },
        instructions: {
          select: { description: true },
          orderBy: { stepNumber: 'asc' },
          take: 1,
        },
        _count: { select: { likes: true } },
      },
    });

    // Map to frontend expected shape
    const mapped = recipes.map((r: any) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      servings: r.servings,
      prepTime: r.prepTime,
      cookTime: r.cookTime,
      difficulty: r.difficulty,
      category: r.category,
      isComplete: r.isComplete,
      isPublic: r.isPublic,
      userId: r.userId,
      user: r.user,
      likeCount: r._count.likes,
      isLiked: false, // Will be set below if user is authenticated
      recipeIngredients: r.recipeIngredients.map((ri: any) => ({
        ingredient: { name: ri.ingredient.name },
      })),
      instructions: r.instructions.map((i: any) => ({
        content: i.description,
      })),
    }));

    // If user is authenticated, check which recipes they liked
    if (req.user) {
      const likedRecipeIds = await prisma.recipeLike.findMany({
        where: {
          userId: req.user.userId,
          recipeId: { in: mapped.map((r: any) => r.id) },
        },
        select: { recipeId: true },
      });
      const likedSet = new Set(likedRecipeIds.map((l: any) => l.recipeId));
      mapped.forEach((r: any) => {
        r.isLiked = likedSet.has(r.id);
      });
    }

    res.json({ success: true, data: mapped });
  } catch (err) {
    next(err);
  }
});

// ============================================
// GET /api/recipes/:id — Single recipe
// ============================================

router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        recipeIngredients: {
          include: {
            ingredient: {
              select: { name: true, scalingRule: true },
            },
          },
        },
        instructions: { orderBy: { stepNumber: 'asc' } },
        images: { orderBy: { order: 'asc' } },
        _count: { select: { likes: true } },
      },
    });

    if (!recipe) {
      throw new AppError(404, 'המתכון לא נמצא');
    }

    // Check access
    if (!recipe.isPublic && recipe.userId !== req.user?.userId) {
      throw new AppError(403, 'אין לך גישה למתכון זה');
    }

    // Check if liked
    let isLiked = false;
    if (req.user) {
      const like = await prisma.recipeLike.findUnique({
        where: {
          userId_recipeId: {
            userId: req.user.userId,
            recipeId: recipe.id,
          },
        },
      });
      isLiked = !!like;
    }

    const mapped = {
      id: recipe.id,
      userId: recipe.userId,
      title: recipe.title,
      description: recipe.description,
      servings: recipe.servings,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      totalTime: recipe.totalTime,
      difficulty: recipe.difficulty,
      category: recipe.category,
      isComplete: recipe.isComplete,
      isPublic: recipe.isPublic,
      user: recipe.user,
      likeCount: recipe._count.likes,
      isLiked,
      recipeIngredients: recipe.recipeIngredients.map((ri: any) => ({
        ingredient: { name: ri.ingredient.name },
        amount: ri.amount,
        unit: ri.unit,
        scalingRule: ri.scalingRule ?? ri.ingredient.scalingRule,
      })),
      instructions: recipe.instructions.map((i: any) => ({
        id: i.id,
        content: i.description,
        order: i.stepNumber,
        stepNumber: i.stepNumber,
        description: i.description,
      })),
      images: recipe.images.map((img: any) => ({
        id: img.id,
        url: img.url,
        caption: img.caption,
        stepNumber: img.stepNumber,
        order: img.order,
        isMain: img.isMain,
      })),
      createdAt: recipe.createdAt.toISOString(),
      updatedAt: recipe.updatedAt.toISOString(),
    };

    res.json({ success: true, data: mapped });
  } catch (err) {
    next(err);
  }
});

// ============================================
// POST /api/recipes — Create recipe
// ============================================

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const data = createRecipeSchema.parse(req.body);

    const recipe = await prisma.recipe.create({
      data: {
        userId: req.user!.userId,
        title: data.title,
        description: data.description,
        servings: data.servings,
        prepTime: data.prepTime,
        cookTime: data.cookTime,
        totalTime: (data.prepTime ?? 0) + (data.cookTime ?? 0) || undefined,
        difficulty: data.difficulty,
        category: data.category,
        isComplete: data.isComplete,
        isPublic: data.isPublic,
        recipeIngredients: {
          create: await Promise.all(
            data.ingredients.map(async (ing) => {
              // Find or create the ingredient
              const ingredient = await prisma.ingredient.upsert({
                where: { name: ing.name.toLowerCase().trim() },
                update: {},
                create: {
                  name: ing.name.toLowerCase().trim(),
                  category: 'other',
                  scalingRule: ing.scalingRule === 'sqrt' ? 'squareRoot' : ing.scalingRule,
                },
              });
              return {
                ingredientId: ingredient.id,
                amount: ing.amount ?? null,
                unit: ing.unit,
                scalingRule: ing.scalingRule === 'sqrt' ? 'squareRoot' : ing.scalingRule,
              };
            })
          ),
        },
        instructions: {
          create: data.instructions.map((inst) => ({
            stepNumber: inst.order + 1,
            description: inst.content,
          })),
        },
        images: {
          create: data.images.map((img) => ({
            url: img.url,
            caption: img.caption,
            stepNumber: img.stepNumber,
            order: img.order,
            isMain: img.isMain,
          })),
        },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        recipeIngredients: {
          include: { ingredient: { select: { name: true, scalingRule: true } } },
        },
        instructions: { orderBy: { stepNumber: 'asc' } },
        images: { orderBy: { order: 'asc' } },
      },
    });

    res.status(201).json({ success: true, data: recipe });
  } catch (err) {
    next(err);
  }
});

// ============================================
// PUT /api/recipes/:id — Update recipe
// ============================================

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    // Verify ownership
    const existing = await prisma.recipe.findUnique({
      where: { id: req.params.id },
      select: { userId: true },
    });

    if (!existing) {
      throw new AppError(404, 'המתכון לא נמצא');
    }
    if (existing.userId !== req.user!.userId) {
      throw new AppError(403, 'אין לך הרשאה לערוך מתכון זה');
    }

    const data = updateRecipeSchema.parse(req.body);

    // Build update object
    const updateData: Record<string, unknown> = {};
    
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.servings !== undefined) updateData.servings = data.servings;
    if (data.prepTime !== undefined) updateData.prepTime = data.prepTime;
    if (data.cookTime !== undefined) updateData.cookTime = data.cookTime;
    if (data.difficulty !== undefined) updateData.difficulty = data.difficulty;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.isComplete !== undefined) updateData.isComplete = data.isComplete;
    if (data.isPublic !== undefined) updateData.isPublic = data.isPublic;

    // Recalculate totalTime if prep or cook changed
    if (data.prepTime !== undefined || data.cookTime !== undefined) {
      updateData.totalTime = (data.prepTime ?? 0) + (data.cookTime ?? 0) || undefined;
    }

    // If ingredients provided, replace them
    if (data.ingredients) {
      await prisma.recipeIngredient.deleteMany({ where: { recipeId: id } });
      
      for (const ing of data.ingredients) {
        const ingredient = await prisma.ingredient.upsert({
          where: { name: ing.name.toLowerCase().trim() },
          update: {},
          create: {
            name: ing.name.toLowerCase().trim(),
            category: 'other',
            scalingRule: ing.scalingRule === 'sqrt' ? 'squareRoot' : ing.scalingRule,
          },
        });
        await prisma.recipeIngredient.create({
          data: {
            recipeId: req.params.id,
            ingredientId: ingredient.id,
            amount: ing.amount ?? null,
            unit: ing.unit,
            scalingRule: ing.scalingRule === 'sqrt' ? 'squareRoot' : ing.scalingRule,
          },
        });
      }
    }

    // If instructions provided, replace them
    if (data.instructions) {
      await prisma.instruction.deleteMany({ where: { recipeId: id } });
      
      for (const inst of data.instructions) {
        await prisma.instruction.create({
          data: {
            recipeId: req.params.id,
            stepNumber: inst.order + 1,
            description: inst.content,
          },
        });
      }
    }

    // If images provided, replace them
    if (data.images) {
      await prisma.recipeImage.deleteMany({ where: { recipeId: id } });
      
      for (const img of data.images) {
        await prisma.recipeImage.create({
          data: {
            recipeId: req.params.id,
            url: img.url,
            caption: img.caption,
            stepNumber: img.stepNumber,
            order: img.order,
            isMain: img.isMain,
          },
        });
      }
    }

    const updated = await prisma.recipe.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true } },
        recipeIngredients: {
          include: { ingredient: { select: { name: true, scalingRule: true } } },
        },
        instructions: { orderBy: { stepNumber: 'asc' } },
        images: { orderBy: { order: 'asc' } },
      },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// ============================================
// DELETE /api/recipes/:id — Delete recipe
// ============================================

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const existing = await prisma.recipe.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      throw new AppError(404, 'המתכון לא נמצא');
    }
    if (existing.userId !== req.user!.userId) {
      throw new AppError(403, 'אין לך הרשאה למחוק מתכון זה');
    }

    await prisma.recipe.delete({ where: { id } });

    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
});

// ============================================
// POST /api/recipes/:id/like — Toggle like
// ============================================

router.post('/:id/like', requireAuth, async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user!.userId;

    // Check recipe exists
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      select: { id: true },
    });
    if (!recipe) {
      throw new AppError(404, 'המתכון לא נמצא');
    }

    // Check if already liked
    const existingLike = await prisma.recipeLike.findUnique({
      where: { userId_recipeId: { userId, recipeId } },
    });

    if (existingLike) {
      // Unlike
      await prisma.recipeLike.delete({ where: { id: existingLike.id } });
    } else {
      // Like
      await prisma.recipeLike.create({ data: { userId, recipeId } });
    }

    const likeCount = await prisma.recipeLike.count({ where: { recipeId } });

    res.json({
      success: true,
      data: {
        liked: !existingLike,
        likeCount,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ============================================
// POST /api/recipes/parse — Parse recipe text
// ============================================

router.post('/parse', requireAuth, async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      throw new AppError(400, 'נדרש טקסט לפענוח');
    }

    const parsed = parseRecipeText(text);
    res.json({ success: true, data: parsed });
  } catch (err) {
    next(err);
  }
});

// ============================================
// Text parser (regex-based, no AI)
// ============================================

interface ParsedIngredient {
  name: string;
  amount: number | null;
  unit: string;
  scalingRule: string;
}

interface ParsedRecipe {
  title?: string;
  servings?: number;
  ingredients: ParsedIngredient[];
  instructions: Array<{ content: string; order: number }>;
}

function parseRecipeText(text: string): ParsedRecipe {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const result: ParsedRecipe = {
    ingredients: [],
    instructions: [],
  };

  // Try to extract title — first non-empty line
  if (lines.length > 0) {
    result.title = lines[0];
  }

  // Try to extract servings
  const servingsMatch = text.match(/(\d+)\s*(מנות|סועדים|אנשים|servings?|portions?)/i);
  if (servingsMatch) {
    result.servings = parseInt(servingsMatch[1], 10);
  }

  // Unit patterns (Hebrew + English)
  const unitPatterns = [
    'כוס', 'כוסות', 'כף', 'כפות', 'כפית', 'כפיות',
    'גרם', 'ג\'', 'מ"ל', 'ליטר', 'ק"ג', 'קילו',
    'cup', 'cups', 'tbsp', 'tsp', 'g', 'ml', 'kg', 'oz', 'lb',
    'יחידה', 'יחידות', 'חבילה', 'חבילות',
  ].join('|');

  // Amount + unit + name pattern
  const ingredientRegex = new RegExp(
    `^[\\-•*]?\\s*(\\d+(?:[./]\\d+)?)\\s*(${unitPatterns})\\s+(.+)$`, 'i'
  );

  // Name + amount pattern (Hebrew style: "קמח - 2 כוסות")
  const hebrewIngredientRegex = new RegExp(
    `^[\\-•*]?\\s*(.+?)\\s*[-–:]\\s*(\\d+(?:[./]\\d+)?)\\s*(${unitPatterns})`, 'i'
  );

  let inInstructions = false;
  let stepOrder = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    // Section headers
    if (/^(מרכיבים|חומרים|ingredients)/i.test(line)) {
      inInstructions = false;
      continue;
    }
    if (/^(הוראות|אופן הכנה|הכנה|instructions|directions|steps)/i.test(line)) {
      inInstructions = true;
      continue;
    }

    if (inInstructions) {
      // Remove step numbering
      const cleaned = line.replace(/^\d+[.)]\s*/, '');
      if (cleaned.length > 2) {
        result.instructions.push({ content: cleaned, order: stepOrder++ });
      }
      continue;
    }

    // Try ingredient patterns
    const match = line.match(ingredientRegex);
    if (match) {
      const amount = parseAmount(match[1]);
      result.ingredients.push({
        name: match[3].trim(),
        amount,
        unit: match[2],
        scalingRule: 'linear',
      });
      continue;
    }

    const hebrewMatch = line.match(hebrewIngredientRegex);
    if (hebrewMatch) {
      const amount = parseAmount(hebrewMatch[2]);
      result.ingredients.push({
        name: hebrewMatch[1].trim(),
        amount,
        unit: hebrewMatch[3],
        scalingRule: 'linear',
      });
      continue;
    }

    // Line with just a number + text (e.g., "3 ביצים")
    const simpleMatch = line.match(/^[\\-•*]?\s*(\d+(?:[./]\d+)?)\s+(.+)$/);
    if (simpleMatch && !inInstructions) {
      result.ingredients.push({
        name: simpleMatch[2].trim(),
        amount: parseAmount(simpleMatch[1]),
        unit: 'יחידה',
        scalingRule: 'linear',
      });
    }
  }

  return result;
}

function parseAmount(str: string): number | null {
  if (!str) return null;
  
  // Handle fractions like "1/2"
  if (str.includes('/')) {
    const [num, den] = str.split('/');
    return Number(num) / Number(den);
  }
  
  const num = parseFloat(str);
  return isNaN(num) ? null : num;
}

export default router;
