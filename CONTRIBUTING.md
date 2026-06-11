# 🤝 Contributing to Recipe Scaling Engine

תודה על העניין לתרום לפרויקט! אנחנו מברכים כל תרומה.

## 🚀 Quick Start

```bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/recipe-scaling-engine.git
cd recipe-scaling-engine

# 3. Install dependencies
npm install

# 4. Setup database
cp .env.example .env
npx prisma generate
npx prisma db push
npx prisma db seed

# 5. Run development
npm run dev
```

## 📋 Before Submitting a PR

וודא שכל הבדיקות הבאות עוברות:

### 1. Type Check
```bash
npm run type-check
```
✅ אפס שגיאות TypeScript

### 2. Linting
```bash
npm run lint
```
✅ אפס errors (warnings מותר)

### 3. Build
```bash
npm run build
```
✅ Build עובר בהצלחה

## 🎨 Code Style

### TypeScript
- **Strict mode** - אסור להשתמש ב-`any` (אלא אם אין ברירה)
- **Interfaces** - השתמש ב-interfaces לכל מבני נתונים
- **const** - השתמש ב-`const` כברירת מחדל, `let` רק אם צריך
- **Optional chaining** - השתמש ב-`?.` ו-`??` לבטיחות

### React
- **Functional Components** - רק functional components + hooks
- **Hooks בראש** - כל ה-hooks בראש הקומפוננטה
- **קומפוננטות קטנות** - כל קומפוננטה עושה דבר אחד
- **React.memo()** - לפריטים ברשימות

### Naming Conventions
- **Components**: `PascalCase` (דוגמה: `RecipeCard`)
- **Functions**: `camelCase` (דוגמה: `scaleIngredient`)
- **Constants**: `UPPER_SNAKE_CASE` (דוגמה: `DEFAULT_SERVINGS`)
- **Files**: לפי שם הקומפוננטה או הפונקציה

### עברית/RTL
- **כל הטקסט בעברית** - UI, הודעות שגיאה, תיעוד
- **Chakra UI logical properties** - `marginStart` במקום `marginLeft`
- **dir="rtl"** - על containers ראשיים

## 🗂️ מבנה קבצים

```
src/
├── pages/              # Page components (routes)
├── components/
│   ├── shared/        # Reusable components (Navbar, Footer)
│   └── ui/            # UI primitives (toaster)
├── lib/
│   ├── api/           # API client functions
│   ├── scaling/       # Business logic (algorithms)
│   └── validations/   # Zod schemas
└── types/             # TypeScript types
```

## 📝 Commit Messages

השתמש בפורמט הבא (בעברית):

```
הוסף: [פיצ'ר חדש]
תקן: [באג שתוקן]
שפר: [שיפור קיים]
עדכן: [עדכון תיעוד/dependencies]
```

**דוגמאות:**
```
הוסף: מערכת תגיות למתכונים
תקן: באג בחישוב scaling logarithmic
שפר: ביצועי RecipeCard עם React.memo
עדכן: Chakra UI ל-v3.32
```

## 🧪 Tests (עתיד)

כרגע אין tests, אבל נשמח לתרומה:

```bash
npm test                # Run tests
npm test -- --watch     # Watch mode
npm test -- --coverage  # Coverage report
```

**אזורים לבדיקה:**
- `lib/scaling/algorithms.ts` - אלגוריתמי scaling
- `lib/scaling/conversions.ts` - המרות יחידות
- `lib/validations/recipe.ts` - Zod schemas
- API routes - integration tests

## 🐛 Reporting Bugs

כשמדווחים על באג, אנא כלול:

1. **תיאור הבעיה** - מה קרה ומה ציפית שיקרה
2. **Steps to reproduce** - איך לשחזר את הבאג
3. **Environment** - OS, Node version, Browser
4. **Screenshots** - אם רלוונטי
5. **Error logs** - console errors

## 💡 Feature Requests

יש רעיון לפיצ'ר חדש? נהדר!

1. בדוק אם הרעיון כבר קיים ב-[TASKS.md](TASKS.md)
2. פתח issue עם:
   - תיאור הפיצ'ר
   - Use case - למה זה שימושי?
   - Mock-ups - אם אפשר
3. חכה לאישור לפני שמתחיל לפתח

## 📚 Resources

- [Tech Stack](README.md#-tech-stack)
- [API Documentation](PROJECT_STATUS.md#-api-endpoints-express)
- [Scaling Algorithms Skill](.github/skills/scaling-algorithms/SKILL.md)
- [Prisma Schema](.github/skills/prisma-database/SKILL.md)
- [Design System](.github/skills/recipe-ui-design/SKILL.md)

## 🎯 Good First Issues

מחפש מאיפה להתחיל? תייגים לחיפוש:
- `good first issue` - פשוט למתחילים
- `help wanted` - צריך עזרה
- `documentation` - שיפור תיעוד
- `enhancement` - שיפורים קטנים

## ❓ Questions?

- פתח **Discussion** ב-GitHub
- שאל ב-**Issues** עם תג `question`

---

**תודה על התרומה! 🙏**
