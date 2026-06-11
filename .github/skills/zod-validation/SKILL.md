---
name: zod-validation
description: וולידציה עם Zod לפרויקט Recipe Scaling Engine. השתמש בסקיל זה כשיוצרים/מעדכנים סכמות וולידציה, מטפלים בשגיאות טפסים, או מוודאים קלט משתמש. כל הודעות השגיאה בעברית.
---

# Zod Validation - Skill

סקיל זה מנחה יצירת וולידציות עם Zod לאפליקציית מתכונים.

## קבצים רלוונטיים
- `src/lib/validations/recipe.ts` - סכמות מתכונים
- `src/lib/validations/index.ts` - exports

## Tech Stack
- **Validation**: Zod (latest)
- **Language**: Hebrew error messages

## סכמות קיימות

### ingredientSchema
```typescript
export const ingredientSchema = z.object({
  name: z.string().min(1, 'שם המרכיב חובה'),
  amount: z.number().nullable().optional(),  // null = לא מולא עדיין
  unit: z.string().min(1, 'יחידת מידה חובה'),
  scalingRule: z.enum(['linear', 'logarithmic', 'sqrt', 'fixed']).default('linear'),
});
```

### instructionSchema
```typescript
export const instructionSchema = z.object({
  content: z.string().min(1, 'הוראה חובה'),
  order: z.number().int().nonnegative(),
});
```

### imageSchema
```typescript
export const imageSchema = z.object({
  url: z.string().url('כתובת URL לא תקינה'),
  caption: z.string().optional(),
  stepNumber: z.number().int().optional(),
  order: z.number().int().nonnegative(),
  isMain: z.boolean().default(false),
});
```

### recipeSchema (מלא)
```typescript
export const recipeSchema = z.object({
  title: z.string().min(1, 'שם המתכון חובה'),
  description: z.string().optional(),
  servings: z.number().int().positive('מספר המנות חייב להיות חיובי'),
  prepTime: z.number().int().nonnegative('זמן הכנה לא יכול להיות שלילי').optional(),
  cookTime: z.number().int().nonnegative('זמן בישול לא יכול להיות שלילי').optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  category: z.string().optional(),
  ingredients: z.array(ingredientSchema).min(1, 'צריך לפחות מרכיב אחד'),
  instructions: z.array(instructionSchema).optional().default([]),
  images: z.array(imageSchema).optional().default([]),
  isComplete: z.boolean().optional().default(true),
  isPublic: z.boolean().optional().default(false),
});
```

### סכמות נגזרות
```typescript
// ליצירה - הכל חובה
export const createRecipeSchema = recipeSchema;

// לעדכון - הכל אופציונלי חוץ מ-title
export const updateRecipeSchema = recipeSchema.partial().omit({ title: true }).merge(
  z.object({ title: z.string().min(1, 'שם המתכון חובה').optional() })
);
```

## טיפוסים מיוצאים

```typescript
export type Ingredient = z.infer<typeof ingredientSchema>;
export type Instruction = z.infer<typeof instructionSchema>;
export type RecipeImage = z.infer<typeof imageSchema>;
export type Recipe = z.infer<typeof recipeSchema>;
export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;
```

## הודעות שגיאה בעברית - מילון

| תבנית | הודעה בעברית |
|-------|-------------|
| Required | שדה חובה |
| Min length | מינימום {n} תווים |
| Max length | מקסימום {n} תווים |
| Invalid number | מספר לא תקין |
| Positive number | חייב להיות מספר חיובי |
| Non-negative | לא יכול להיות שלילי |
| Invalid email | כתובת אימייל לא תקינה |
| Invalid URL | כתובת URL לא תקינה |
| Invalid enum | ערך לא תקין |
| Array min | צריך לפחות {n} פריטים |
| Array max | מקסימום {n} פריטים |

## דפוסי שימוש נפוצים

### 1. וולידציה בטופס
```typescript
import { recipeSchema } from '@/lib/validations/recipe';

function handleSubmit(formData: unknown) {
  try {
    const validated = recipeSchema.parse(formData);
    // שלח ל-API
    await createRecipe(validated);
    toast.success({ description: 'המתכון נשמר בהצלחה' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // טפל בשגיאות וולידציה
      const firstError = error.errors[0];
      toast.error({ description: firstError.message });
    }
  }
}
```

### 2. וולידציה ב-API Route
```typescript
import { createRecipeSchema } from '@/lib/validations/recipe';

export async function POST(request: Request) {
  const body = await request.json();
  
  const result = createRecipeSchema.safeParse(body);
  
  if (!result.success) {
    return Response.json(
      { 
        success: false, 
        error: 'נתונים לא תקינים',
        details: result.error.flatten().fieldErrors 
      },
      { status: 400 }
    );
  }
  
  const recipe = await prisma.recipe.create({ data: result.data });
  return Response.json({ success: true, data: recipe });
}
```

### 3. וולידציה עם transform
```typescript
const servingsSchema = z
  .string()
  .transform((val) => parseInt(val, 10))
  .refine((val) => !isNaN(val) && val > 0, {
    message: 'מספר מנות חייב להיות מספר חיובי',
  });
```

### 4. וולידציה מותנית
```typescript
const recipeWithBakingSchema = recipeSchema.extend({
  bakingParameters: z.object({
    ovenTemp: z.number().min(100, 'טמפרטורה מינימלית 100°C').max(300, 'טמפרטורה מקסימלית 300°C'),
    bakingTime: z.number().positive('זמן אפייה חייב להיות חיובי'),
  }).optional(),
}).refine(
  (data) => {
    // אם יש קטגוריית אפייה, חייב להיות פרמטרים
    if (data.category === 'baking' && !data.bakingParameters) {
      return false;
    }
    return true;
  },
  { message: 'מתכון אפייה חייב לכלול פרמטרי תנור' }
);
```

## יצירת סכמה חדשה - תבנית

```typescript
import { z } from 'zod';

// 1. הגדר את הסכמה
export const newEntitySchema = z.object({
  // שדות חובה
  name: z.string().min(1, 'שם חובה'),
  
  // שדות מספריים
  amount: z.number()
    .positive('הכמות חייבת להיות חיובית')
    .max(10000, 'הכמות גדולה מדי'),
  
  // שדות אופציונליים
  description: z.string().max(500, 'תיאור ארוך מדי').optional(),
  
  // enums
  status: z.enum(['active', 'inactive'], {
    errorMap: () => ({ message: 'סטטוס לא תקין' }),
  }),
  
  // arrays
  tags: z.array(z.string()).min(1, 'צריך לפחות תגית אחת').max(10, 'מקסימום 10 תגיות'),
  
  // defaults
  isPublic: z.boolean().default(false),
});

// 2. יצא טיפוסים
export type NewEntity = z.infer<typeof newEntitySchema>;

// 3. יצא סכמות נגזרות
export const createNewEntitySchema = newEntitySchema;
export const updateNewEntitySchema = newEntitySchema.partial();
```

## Refinements מתקדמים

### Custom validation
```typescript
const passwordSchema = z.string()
  .min(8, 'סיסמה חייבת להכיל לפחות 8 תווים')
  .refine(
    (val) => /[A-Z]/.test(val),
    'סיסמה חייבת להכיל אות גדולה'
  )
  .refine(
    (val) => /[0-9]/.test(val),
    'סיסמה חייבת להכיל מספר'
  );
```

### Cross-field validation
```typescript
const timeRangeSchema = z.object({
  prepTime: z.number().optional(),
  cookTime: z.number().optional(),
}).refine(
  (data) => {
    if (data.prepTime && data.cookTime) {
      return data.prepTime + data.cookTime <= 480; // max 8 hours
    }
    return true;
  },
  { message: 'זמן הכנה ובישול לא יכול לעלות על 8 שעות' }
);
```

### Async validation
```typescript
const uniqueTitleSchema = z.string()
  .min(1, 'שם המתכון חובה')
  .refine(
    async (title) => {
      const existing = await prisma.recipe.findFirst({
        where: { title, userId: currentUserId },
      });
      return !existing;
    },
    { message: 'כבר יש לך מתכון עם שם זה' }
  );
```

## שילוב עם React Hook Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { recipeSchema, Recipe } from '@/lib/validations/recipe';

function RecipeForm() {
  const form = useForm<Recipe>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: '',
      servings: 1,
      ingredients: [],
      instructions: [],
    },
  });
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormControl isInvalid={!!form.formState.errors.title}>
        <FormLabel>שם המתכון</FormLabel>
        <Input {...form.register('title')} />
        <FormErrorMessage>
          {form.formState.errors.title?.message}
        </FormErrorMessage>
      </FormControl>
      {/* ... */}
    </form>
  );
}
```

## Error Handling Utilities

```typescript
// פונקציית עזר לפורמט שגיאות
export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  
  for (const err of error.errors) {
    const path = err.path.join('.');
    errors[path] = err.message;
  }
  
  return errors;
}

// שימוש
try {
  recipeSchema.parse(data);
} catch (error) {
  if (error instanceof z.ZodError) {
    const fieldErrors = formatZodErrors(error);
    // { 'title': 'שדה חובה', 'ingredients.0.amount': 'מספר לא תקין' }
  }
}
```

## Best Practices

1. **תמיד הגדר הודעות שגיאה בעברית** - חווית משתמש טובה יותר
2. **השתמש ב-safeParse ב-API** - לא זורק exceptions
3. **השתמש ב-parse בטפסים** - קל יותר לתפוס שגיאות
4. **יצא טיפוסים** - שמור על type safety
5. **השתמש ב-defaults** - פחות edge cases
6. **refine רק כשצריך** - validation פשוט קודם
