---
name: prisma-database
description: עבודה עם Prisma ומסד הנתונים בפרויקט Recipe Scaling Engine. השתמש בסקיל זה כשיוצרים/מעדכנים סכמות, כותבים queries, או עובדים עם הנתונים. כולל כל המודלים והטיפוסים של הפרויקט.
---

# Prisma Database - Skill

סקיל זה מנחה עבודה עם Prisma ORM במערכת מתכונים.

## קבצים רלוונטיים
- `prisma/schema.prisma` - הגדרות המודלים
- `prisma/seed.ts` - data seeding
- `src/lib/api/recipes.ts` - API functions
- `prisma.config.ts` - Prisma configuration

## Tech Stack
- **ORM**: Prisma 7.2.0
- **Database**: PostgreSQL (production), SQLite (dev compatible)
- **Preview Features**: driverAdapters

## מודלים עיקריים

### User (משתמש)
```prisma
model User {
  id              String   @id @default(cuid())
  email           String   @unique
  name            String?
  password        String?
  preferredSystem String   @default("metric")  // metric | imperial
  language        String   @default("he")
  
  recipes         Recipe[]
  likes           RecipeLike[]
}
```

### Recipe (מתכון)
```prisma
model Recipe {
  id          String   @id @default(cuid())
  userId      String
  title       String
  description String?
  servings    Int      @default(1)
  prepTime    Int?     // minutes
  cookTime    Int?     // minutes
  difficulty  String?  // easy | medium | hard
  category    String?
  imageUrl    String?
  isComplete  Boolean  @default(true)
  isPublic    Boolean  @default(false)
  
  // Relations
  user              User               @relation(...)
  recipeIngredients RecipeIngredient[]
  instructions      Instruction[]
  tags              RecipeTag[]
  bakingParameters  BakingParameters?
  versions          RecipeVersion[]
  images            RecipeImage[]
}
```

### Ingredient (מרכיב - מאסטר)
```prisma
model Ingredient {
  id          String  @id @default(cuid())
  name        String  @unique
  nameHebrew  String?
  category    String  // flour, sugar, fat, protein, leavening, liquid, spice, other
  scalingRule String  @default("linear")  // linear, logarithmic, squareRoot, fixed
  
  // Nutritional (per 100g)
  calories    Float?
  protein     Float?
  carbs       Float?
  fat         Float?
  
  recipeIngredients RecipeIngredient[]
}
```

### RecipeIngredient (מרכיב במתכון)
```prisma
model RecipeIngredient {
  id           String  @id @default(cuid())
  recipeId     String
  ingredientId String
  amount       Float?  // null = not filled yet
  unit         String  // g, ml, cup, tsp, tbsp
  preparation  String? // "chopped", "melted"
  optional     Boolean @default(false)
  scalingRule  String? // override ingredient default
  
  recipe     Recipe     @relation(...)
  ingredient Ingredient @relation(...)
}
```

### Instruction (הוראה)
```prisma
model Instruction {
  id          String @id @default(cuid())
  recipeId    String
  stepNumber  Int
  description String
  imageUrl    String?
  time        Int?   // minutes
  
  @@unique([recipeId, stepNumber])
}
```

### BakingParameters (פרמטרי אפייה)
```prisma
model BakingParameters {
  id           String  @id @default(cuid())
  recipeId     String  @unique
  ovenTemp     Int?    // celsius
  convection   Boolean @default(false)
  panType      String?
  panSize      String?
  bakingTime   Int?    // minutes
  baseServings Int     // for scaling time
}
```

## Queries נפוצות

### יצירת מתכון עם כל הקשרים
```typescript
const recipe = await prisma.recipe.create({
  data: {
    userId,
    title: 'עוגת שוקולד',
    servings: 8,
    recipeIngredients: {
      create: [
        {
          ingredientId: 'flour-id',
          amount: 200,
          unit: 'g',
        },
        {
          ingredientId: 'sugar-id',
          amount: 150,
          unit: 'g',
        },
      ],
    },
    instructions: {
      create: [
        { stepNumber: 1, description: 'חמם תנור ל-180 מעלות' },
        { stepNumber: 2, description: 'ערבב את המרכיבים היבשים' },
      ],
    },
  },
  include: {
    recipeIngredients: {
      include: { ingredient: true },
    },
    instructions: { orderBy: { stepNumber: 'asc' } },
  },
});
```

### קריאת מתכון מלא
```typescript
const recipe = await prisma.recipe.findUnique({
  where: { id: recipeId },
  include: {
    user: { select: { id: true, name: true } },
    recipeIngredients: {
      include: { ingredient: true },
      orderBy: { id: 'asc' },
    },
    instructions: { orderBy: { stepNumber: 'asc' } },
    bakingParameters: true,
    tags: { include: { tag: true } },
    images: { orderBy: { order: 'asc' } },
    _count: { select: { likes: true } },
  },
});
```

### רשימת מתכונים של משתמש
```typescript
const recipes = await prisma.recipe.findMany({
  where: { userId },
  orderBy: { updatedAt: 'desc' },
  include: {
    recipeIngredients: { take: 5 },
    _count: { select: { likes: true } },
  },
});
```

### חיפוש מתכונים
```typescript
const recipes = await prisma.recipe.findMany({
  where: {
    OR: [
      { title: { contains: searchTerm, mode: 'insensitive' } },
      { description: { contains: searchTerm, mode: 'insensitive' } },
    ],
    isPublic: true,
  },
});
```

### עדכון מתכון
```typescript
const updated = await prisma.recipe.update({
  where: { id: recipeId },
  data: {
    title: 'עוגת שוקולד משופרת',
    servings: 10,
    recipeIngredients: {
      deleteMany: {},  // מחק הכל ויצור מחדש
      create: newIngredients,
    },
    instructions: {
      deleteMany: {},
      create: newInstructions,
    },
  },
  include: {
    recipeIngredients: { include: { ingredient: true } },
    instructions: true,
  },
});
```

### מחיקת מתכון
```typescript
// Cascade delete מוגדר בסכמה - מוחק הכל אוטומטית
await prisma.recipe.delete({
  where: { id: recipeId },
});
```

## Transaction לפעולות מורכבות

```typescript
const result = await prisma.$transaction(async (tx) => {
  // 1. צור מתכון
  const recipe = await tx.recipe.create({ data: recipeData });
  
  // 2. צור מרכיב חדש אם לא קיים
  const ingredient = await tx.ingredient.upsert({
    where: { name: 'קמח תופח' },
    create: { name: 'קמח תופח', category: 'flour', scalingRule: 'linear' },
    update: {},
  });
  
  // 3. קשר מרכיב למתכון
  await tx.recipeIngredient.create({
    data: {
      recipeId: recipe.id,
      ingredientId: ingredient.id,
      amount: 200,
      unit: 'g',
    },
  });
  
  return recipe;
});
```

## Error Handling

```typescript
import { Prisma } from '@prisma/client';

try {
  const recipe = await prisma.recipe.create({ data });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new Error('כבר קיים מתכון עם שם זה');
      case 'P2025':
        throw new Error('המתכון לא נמצא');
      case 'P2003':
        throw new Error('המרכיב לא קיים במערכת');
      default:
        throw new Error('שגיאה בפעולת מסד הנתונים');
    }
  }
  throw error;
}
```

## קודים נפוצים של שגיאות Prisma

| קוד | משמעות | פתרון |
|-----|---------|--------|
| P2002 | Unique constraint violation | שדה ייחודי כבר קיים |
| P2025 | Record not found | findUnique החזיר null |
| P2003 | Foreign key constraint | הקשר לא קיים |
| P2014 | Relation violation | לא ניתן למחוק בגלל קשר |

## Best Practices

### 1. תמיד השתמש ב-include
```typescript
// ❌ רע - עושה N+1 queries
const recipe = await prisma.recipe.findUnique({ where: { id } });
const ingredients = await prisma.recipeIngredient.findMany({ where: { recipeId: id } });

// ✅ טוב - query אחת
const recipe = await prisma.recipe.findUnique({
  where: { id },
  include: { recipeIngredients: true },
});
```

### 2. צמצם שדות עם select
```typescript
// רק מה שצריך להציג ברשימה
const recipes = await prisma.recipe.findMany({
  select: {
    id: true,
    title: true,
    imageUrl: true,
    servings: true,
    _count: { select: { likes: true } },
  },
});
```

### 3. Pagination
```typescript
const recipes = await prisma.recipe.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  orderBy: { createdAt: 'desc' },
});
```

### 4. Validate לפני DB
```typescript
import { recipeSchema } from '@/lib/validations/recipe';

// תמיד validate עם Zod לפני שליחה ל-DB
const validated = recipeSchema.parse(formData);
const recipe = await prisma.recipe.create({ data: validated });
```

## פקודות CLI

```bash
# Generate client
npx prisma generate

# Push schema to DB (dev)
npx prisma db push

# Create migration
npx prisma migrate dev --name add_feature

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio

# Seed database
npx prisma db seed
```

## Indexes שכבר מוגדרים

```prisma
@@index([userId])           // Recipe - חיפוש לפי משתמש
@@index([recipeId])         // RecipeIngredient, Instruction
@@index([ingredientId])     // RecipeIngredient
@@index([fromUnit, toUnit]) // UnitConversion
```

## זכור

1. **Cascade Delete** מוגדר - מחיקת Recipe מוחקת הכל
2. **`cuid()`** לכל IDs - לא UUID
3. **`@map`** לשמות טבלאות - snake_case ב-DB
4. **Relations חייבים להיות דו-כיווניים** ב-Prisma
