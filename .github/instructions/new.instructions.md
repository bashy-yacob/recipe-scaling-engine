---
applyTo: "**"
---
# Recipe Scaling Engine - Instructions

> 📚 סקילים מפורטים נמצאים ב: `.github/skills/`

## Tech Stack
- **Frontend**: React 19 + Vite + TypeScript 5.9 (strict)
- **UI**: Chakra UI v3 + Lucide React + Framer Motion
- **Database**: Prisma 7.2 + PostgreSQL
- **Validation**: Zod

## מבנה הפרויקט
```
src/
├── components/
│   ├── shared/      # Navbar, Footer, ImageUploader
│   └── ui/          # toaster
├── lib/
│   ├── api/         # API client functions
│   ├── scaling/     # algorithms.ts, conversions.ts
│   └── validations/ # Zod schemas
├── pages/
│   ├── recipes/     # CRUD pages
│   ├── auth/        # Login, Register
│   └── demo/        # Demo page
├── styles/          # globals.css
└── types/           # TypeScript types
```

## הקונספט המרכזי - Scaling חכם

4 סוגי אלגוריתמים לשינוי כמויות:

| Rule | שימוש | דוגמה |
|------|-------|-------|
| `linear` | רוב המרכיבים | קמח, סוכר, מים |
| `logarithmic` | מרכיבים אקטיביים | שמרים, שוקולד |
| `sqrt` | תבלינים | מלח, פלפל |
| `fixed` | כמות קבועה | וניל, צבע מאכל |

> 📚 פירוט מלא: `.github/skills/scaling-algorithms/SKILL.md`

## Interfaces עיקריים

```typescript
interface Recipe {
  id: string;
  title: string;
  servings: number;
  ingredients: Ingredient[];
  instructions: Instruction[];
}

interface Ingredient {
  name: string;
  amount: number | null;
  unit: string;
  scalingRule: 'linear' | 'logarithmic' | 'sqrt' | 'fixed';
}
```

## סטנדרטים

### TypeScript
- Strict mode - אין `any`
- Interfaces לכל מבני נתונים
- `const` כברירת מחדל
- `?.` ו-`??` לבטיחות

### React
- Functional components + hooks בלבד
- Hooks בראש הקומפוננטה
- קומפוננטות קטנות וממוקדות
- `React.memo()` לפריטי רשימה

### Naming
- Components: `PascalCase`
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Files: לפי שם הקומפוננטה

## עבודה עם Database

> 📚 פירוט מלא: `.github/skills/prisma-database/SKILL.md`

```typescript
// תמיד עם include לקשרים
const recipe = await prisma.recipe.findUnique({
  where: { id },
  include: { 
    recipeIngredients: { include: { ingredient: true } },
    instructions: { orderBy: { stepNumber: 'asc' } }
  }
});
```

## Validation

> 📚 פירוט מלא: `.github/skills/zod-validation/SKILL.md`

```typescript
import { recipeSchema } from '@/lib/validations/recipe';

// תמיד validate לפני DB
const validated = recipeSchema.parse(formData);
```

הודעות שגיאה בעברית: "שדה חובה", "מספר לא תקין"

## UI Patterns

### עברית/RTL
- כל הטקסט בעברית
- `dir="rtl"` על containers
- Logical properties בלבד

### Toast Notifications
```typescript
import { toast } from '@/components/ui/toaster';
toast.success({ description: 'המתכון נשמר בהצלחה' });
toast.error({ description: 'שגיאה בשמירה' });
```

### Loading States
```tsx
if (isLoading) return <Spinner color="orange.500" />;
```

## API Format
```typescript
// הצלחה
{ success: true, data: Recipe }

// שגיאה
{ success: false, error: string }
```

## Git Workflow

### Commit Messages (עברית)
```bash
git commit -m "הוסף: [פיצ'ר חדש]"
git commit -m "תקן: [באג שתוקן]"
git commit -m "שפר: [שיפור]"
```

### לפני Push
- [ ] `npm run build` עובר
- [ ] אין שגיאות TypeScript
- [ ] נבדק ידנית
- [ ] PROJECT_STATUS.md מעודכן

### מתי לעשות Push
✅ פיצ'ר חדש מושלם ונבדק
✅ תיקון באג שעובד
✅ שינויי DB (migrations)
❌ לא אחרי: typos, WIP, formatting

## עבודה על פיצ'ר חדש

1. הוסף קוד ב-`src/lib/` המתאים
2. עדכן types ב-`src/types/`
3. הוסף Zod validation אם צריך
4. עדכן API routes
5. עדכן UI components
6. בדוק end-to-end
7. עדכן PROJECT_STATUS.md

## בדיקות

> 📚 פירוט מלא: `.github/skills/testing/SKILL.md`

```bash
npm test              # הרץ בדיקות
npm test -- --watch   # watch mode
npm test -- --coverage
```

## Self-Check לפני "סיימתי"

- [ ] `npm run build` עובר?
- [ ] נבדק ידנית?
- [ ] Types מעודכנים?
- [ ] Validation מעודכן?
- [ ] PROJECT_STATUS.md מעודכן?

## הערות
- SQLite לפיתוח, PostgreSQL לייצור
- **סטטוס נוכחי: ~70% הושלם** (עדכון: 11.2.2026)
- **הושלם**: Backend מלא, Scaling, Validation, Auth (JWT), 9 API endpoints
- **נותר**: useAuth Context, Error Boundaries, Tests, Optimizations
- State management מקומי (בלי Redux/Zustand)
