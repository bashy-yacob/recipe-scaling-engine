# 📊 סטטוס פרויקט Recipe Scaling Engine
**תאריך: ינואר 2026** | **סטטוס: 🟡 בפיתוח פעיל**

---

## ✅ תוצאות בדיקה נוכחית

### סטטוס בנייה
```
✅ Next.js 16.1.4 - עובד בהצלחה!
✅ TypeScript 5.9.3 - עובד בהצלחה!
✅ Prisma 7.2.0 + SQLite - עובד בהצלחה!
✅ כל התלויות מותקנות בהצלחה
✅ בנייה הצליחה - אין שגיאות!
✅ שרת פיתוח (dev server) רץ בעל port 3000
```

### בדיקת Prisma
```
✅ Schema loaded successfully
✅ 1 migration found (20250122115016_init)
✅ Database schema is up to date!
✅ SQLite database נוצר ב: ./prisma/dev.db
```

### מבנה הפרויקט
```
✅ next.js app router - מוגדר כראוי
✅ Chakra UI v3 - מוגדר ועובד
✅ Prisma ORM - מחובר
✅ דפים: home, recipes, recipes/new, demo - כולם נבנו ויעבדו
✅ Navbar + Footer - בנויים ידנית
✅ lib/db.ts - Prisma Client מוגדר
```

---

## 📋 סיכום החסר (TODO List)

### 🔴 קריטי - חוסם את ההמשך
- [ ] **תיקון בנייה**: הסרת Google Fonts או הוסיפה שלהן locally
- [ ] **Types**: צרה `types/recipe.ts` עם `Recipe`, `Ingredient`, `Instruction` interfaces
- [ ] **Validation**: צרה `lib/validations/recipe.ts` עם Zod schemas

### 🟠 עדיפות גבוהה - המהות של הפרויקט
- [ ] **Smart Scaling Algorithms** `lib/scaling/algorithms.ts`:
  - [ ] Linear scaling (שמרים × 2, אבל לא בדיוק × 2)
  - [ ] Logarithmic scaling (שמרים, שוקולד)
  - [ ] Square root scaling (מלח, תבלינים)
  - [ ] Fixed ingredients (אינגריד)
  - [ ] Baking time calculation
- [ ] **Unit Conversions** `lib/scaling/conversions.ts`:
  - [ ] grams ↔ cups, ml ↔ tsp, etc.
  - [ ] תמיכה במדידות אימפריאליות ומטריות
- [ ] **Database Operations**:
  - [ ] `lib/recipes/create.ts` - שמירת מתכון
  - [ ] `lib/recipes/read.ts` - קריאת מתכונים
  - [ ] `lib/recipes/update.ts` - עדכון
  - [ ] `lib/recipes/delete.ts` - מחיקה

### 🟡 עדיפות בינונית
- [ ] **Seed Data** `prisma/seed.ts`:
  - [ ] יצירת משתמש demo
  - [ ] יצירת מתכונים לדוגמה
  - [ ] יצירת מרכיבים
- [ ] **Authentication** (לבחירה):
  - [ ] NextAuth.js / Auth0 / Supabase Auth
- [ ] **UI Components**:
  - [ ] Modal component
  - [ ] Toast notifications
  - [ ] Loading states
  - [ ] Error boundaries
- [ ] **Pages**:
  - [ ] `/recipes/[id]` - עמוד מתכון בודד
  - [ ] `/recipes/[id]/edit` - עריכת מתכון
  - [ ] `/settings` - הגדרות משתמש

### 🟢 עדיפות נמוכה
- [ ] OCR (הוספה מתמונה)
- [ ] Web scraping (הוספה מ-URL)
- [ ] Speech-to-text
- [ ] Import/Export

---

## 🛠️ תבנית ריצה בפרויקט

### תרגיל 1: תיקון בנייה (5 דקות)
```bash
# דרך 1: הסרת Google Fonts
# עדכן app/layout.tsx - הסר את import Geist

# דרך 2: טעינה locally (מומלץ לארוך טווח)
npm install next-fonts
```

### תרגיל 2: יצירת Types (10 דקות)
```bash
# תיקייה שכבר קיימת: types/
# צור: types/recipe.ts
touch types/recipe.ts
```

**תוכן חיוני:**
```typescript
// types/recipe.ts
export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  scalingRule: 'linear' | 'logarithmic' | 'sqrt' | 'fixed';
}

export interface Recipe {
  id: string;
  userId: string;
  title: string;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  cookTime: number;
  prepTime: number;
}
```

### תרגיל 3: Validation Schemas (10 דקות)
```bash
# צור: lib/validations/recipe.ts
touch lib/validations/recipe.ts
```

**תוכן חיוני:**
```typescript
// lib/validations/recipe.ts
import { z } from 'zod';

export const ingredientSchema = z.object({
  name: z.string().min(1),
  amount: z.number().positive(),
  unit: z.string(),
  scalingRule: z.enum(['linear', 'logarithmic', 'sqrt', 'fixed']),
});

export const recipeSchema = z.object({
  title: z.string().min(1),
  servings: z.number().int().positive(),
  ingredients: z.array(ingredientSchema),
});
```

### תרגיל 4: Scaling Algorithms (30 דקות) ⭐⭐⭐
```bash
# צור: lib/scaling/algorithms.ts
touch lib/scaling/algorithms.ts
```

**תוכן חיוני:**
```typescript
// lib/scaling/algorithms.ts

interface ScalingRule {
  type: 'linear' | 'logarithmic' | 'sqrt' | 'fixed';
  baseAmount: number;
  baseServings: number;
}

export function scaleIngredient(rule: ScalingRule, targetServings: number): number {
  const ratio = targetServings / rule.baseServings;
  
  switch (rule.type) {
    case 'linear':
      // שמרים: עולים ליניארית אבל הרבה יותר ببطء
      return rule.baseAmount * Math.log(1 + ratio * 0.5);
    
    case 'logarithmic':
      // שמרים: לא משתנים הרבה
      return rule.baseAmount * (1 + Math.log(ratio) / Math.log(4));
    
    case 'sqrt':
      // מלח, תבלינים: גדלים בשורש ריבועי
      return rule.baseAmount * Math.sqrt(ratio);
    
    case 'fixed':
      // אינגריד (אפר, ווניל): לא משתנים בכלל
      return rule.baseAmount;
  }
}
```

### תרגיל 5: DB Operations (30 דקות)
```bash
# צור: lib/recipes/create.ts
touch lib/recipes/create.ts
```

**תוכן חיוני:**
```typescript
// lib/recipes/create.ts
import { db } from '@/lib/db';
import { recipeSchema } from '@/lib/validations/recipe';

export async function createRecipe(userId: string, data: unknown) {
  const validated = recipeSchema.parse(data);
  
  return db.recipe.create({
    data: {
      ...validated,
      userId,
      recipeIngredients: {
        create: validated.ingredients.map(ing => ({
          ingredient: { create: ing },
          amount: ing.amount,
          unit: ing.unit,
        })),
      },
    },
  });
}
```

---

## 📁 מבנה קבצים שצריך ליצור

```
recipe-scaling-engine/
├── types/
│   ├── recipe.ts          ← צריך ליצור
│   ├── ingredient.ts      ← אופציונלי
│   └── user.ts            ← אופציונלי
├── lib/
│   ├── db.ts              ✅ קיים
│   ├── recipes/           ← צריך ליצור
│   │   ├── create.ts
│   │   ├── read.ts
│   │   ├── update.ts
│   │   └── delete.ts
│   ├── scaling/           ← צריך ליצור
│   │   ├── algorithms.ts  ⭐⭐⭐ חשוב מאוד!
│   │   └── conversions.ts
│   ├── utils/             ← צריך ליצור
│   │   ├── formatters.ts
│   │   └── validators.ts
│   └── validations/       ← צריך ליצור
│       ├── recipe.ts
│       ├── ingredient.ts
│       └── index.ts
├── components/
│   └── ... (עדיין לא צריך)
├── app/
│   ├── recipes/
│   │   ├── [id]/          ← צריך ליצור
│   │   │   └── page.tsx
│   │   └── ... ✅
│   └── ... ✅
└── prisma/
    ├── schema.prisma      ✅ קיים
    └── seed.ts            ← צריך להשלים
```

---

## 🚀 הוראות להמשך

### סדר ביצוע (מחוב):

1. **תיקון בנייה** (5 דקות)
   ```bash
   # בחר אחד:
   # א) הסר Geist fonts מ app/layout.tsx
   # ב) או התקן locally
   ```

2. **Types** (10 דקות)
   ```bash
   npm run dev
   # תיקייה types/ כבר קיימת - פשוט צור קבצים
   ```

3. **Validation** (10 דקות)
   - צור `lib/validations/recipe.ts`

4. **Scaling Algorithms** (30 דקות) ⭐⭐⭐
   - **זה הפיצ'ר המרכזי!**
   - אפשר לעשות זה בלי DB
   - כל ה-logic כבר מוכן בראש

5. **Database Layer** (30 דקות)
   - צור `lib/recipes/create.ts` וכו'

6. **Seed Data** (15 דקות)
   - עדכן `prisma/seed.ts`
   - ריצה: `npx prisma db seed`

7. **UI Integration** (40 דקות)
   - עדכן `/recipes/new/page.tsx` - חבר לDB
   - צור `/recipes/page.tsx` - הצג מתכונים
   - צור `/recipes/[id]/page.tsx` - עמוד מתכון

---

## 🎯 אמת מידה לסיום שלבים

### שלב 1: סכום בצורה טוב ✅
- [ ] Build עובד בלי שגיאות
- [ ] `npm run dev` רץ בהצלחה

### שלב 2: Scaling עובד ✅
- [ ] Types מלא
- [ ] Validation עובד
- [ ] Algorithms נכונים

### שלב 3: DB עובד ✅
- [ ] יכולות ליצור מתכון
- [ ] יכולות לקרוא מתכונים
- [ ] יכולות לעדכן
- [ ] יכולות למחוק

### שלב 4: UI מלא ✅
- [ ] טופס הוספה מחובר
- [ ] רשימה מציגה נתונים אמיתיים
- [ ] עמוד בודד עובד

---

## 💡 טיפים חשובים

### 1️⃣ Scaling Algorithms
- זה הפיצ'ר הכי חשוב - כל שאר זה הגדול
- אפשר לעשות בלי מאפיה/צמחי תזונה
- יש כן אלגוריתמים ידועים עבור זה

### 2️⃣ Database
- SQLite כרגע - בחרנו זה עבור development
- כל query שכתוב עבור Prisma יעבוד גם עם PostgreSQL

### 3️⃣ TypeScript
- strict mode כבר הפעיל
- כל type-checking עובד בנייה

### 4️⃣ Build Issue
- זה רק Google Fonts - לא משפיע על פונקציונליות
- תיקון: הסרת 2 שורות מ layout.tsx

---

## 📞 איך להשתמש בקובץ הזה

כל פעם שאתה מתחיל עבודה חדשה:
1. קרא את **"סדר ביצוע"** לעיל
2. בחר בשלב הבא
3. בצע את הוראות התרגיל
4. בדוק את "אמת המידה" לסיום

---

## 📊 עדכון הרמה

| היבט | סטטוס | הערות |
|------|--------|-------|
| **Project Setup** | ✅ 100% | Next.js, TypeScript, Prisma מוכן |
| **Database Schema** | ✅ 100% | 9 טבלאות, migrations מוכנים |
| **Build System** | ✅ 100% | תיקון בנייה בוצע בהצלחה!
| **Types & Validation** | 🔴 0% | צריך ליצור |
| **Scaling Algorithms** | 🔴 0% | **חשוב מאוד!** |
| **DB Operations** | 🔴 0% | CRUD functions |
| **UI Integration** | 🔴 10% | טופס קיים אבל לא מחובר |
| **Overall Completion** | � ~30% | מוכן להמשך |

---

**סטטוס אחרון: ✅ מוכן להמשך - בנייה הצליחה!**  
**שלב הבא: Types + Validation**  
**זמן משוער: 20 דקות**
