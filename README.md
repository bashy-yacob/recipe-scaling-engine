# 🍳 Recipe Scaling Engine

> **מערכת חכמה לשינוי כמויות במתכונים** - אלגוריתמים מתקדמים לבישול ואפייה מושלמים

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646cff)](https://vitejs.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-7.2-2d3748)](https://www.prisma.io/)

---

## 🎯 מה זה?

Recipe Scaling Engine היא אפליקציית SPA מתקדמת לניהול מתכונים עם יכולת **שינוי כמויות חכם**.  
במקום כפל פשוט, המערכת משתמשת ב-4 אלגוריתמים מותאמים למרכיבים שונים.

### 🌟 פיצ'רים עיקריים

- ⚖️ **4 אלגוריתמי Scaling** - linear, logarithmic, sqrt, fixed
- 🤖 **AI Recipe Parsing** - פענוח מתכונים מטקסט חופשי (Groq)
- 🔐 **אימות מלא** - JWT + bcrypt
- 📊 **CRUD מלא** - יצירה, עריכה, מחיקה
- ❤️ **מערכת לייקים** - סימון מתכונים מועדפים
- 🔍 **סינון ומיון** - לפי קטגוריה, קושי, זמן
- 🌐 **מתכונים פרטיים/ציבוריים** - שיתוף עם הקהילה
- 📐 **המרות יחידות** - Metric ↔ Imperial

---

## 🚀 Quick Start

```bash
# 1. Clone & Install
git clone <repo-url>
cd recipe-scaling-engine
npm install

# 2. Setup Database
cp .env.example .env
# ערוך DATABASE_URL ב-.env
npx prisma generate
npx prisma db push
npx prisma db seed

# 3. Run Development
npm run dev
```

**Frontend**: http://localhost:3000  
**Backend API**: http://localhost:3001

---

## 🛠️ Tech Stack

### Frontend (SPA)
- **React 19** - UI Library
- **Vite 6.4** - Build tool + Dev server
- **React Router 6** - Client-side routing
- **TypeScript 5.9** - Type safety (strict mode)
- **Chakra UI v3** - Component library
- **Framer Motion** - Animations
- **Zod** - Schema validation
- **React Hook Form** - Form management

### Backend
- **Express 5** - Web server
- **Prisma 7.2** - ORM
- **PostgreSQL / SQLite** - Database
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **Groq SDK** - AI recipe parsing

---

## ⚖️ אלגוריתמי Scaling

| Algorithm | מתי להשתמש | נוסחה | דוגמה (4→8) |
|-----------|-----------|-------|-------------|
| **linear** | קמח, סוכר, מים | `amount × ratio` | 200g → 400g |
| **logarithmic** | שמרים, אבקת אפייה | `amount × (1 + log(ratio)/log(4))` | 7g → 8.75g |
| **sqrt** | מלח, תבלינים | `amount × √ratio` | 5g → 7g |
| **fixed** | ווניל, קישוט | `amount` | 1 tsp → 1 tsp |

**קרא עוד:** [Scaling Algorithms Skill](.github/skills/scaling-algorithms/SKILL.md)

---

## 📁 מבנה הפרויקט

```
recipe-scaling-engine/
├── src/                    # Frontend (React SPA)
│   ├── pages/             # 10 page components
│   ├── components/        # Reusable UI
│   ├── lib/
│   │   ├── api/          # API client
│   │   ├── scaling/      # Algorithms (216 lines)
│   │   └── validations/  # Zod schemas
│   └── types/            # TypeScript types
│
├── server/                # Backend (Express)
│   ├── index.ts          # Server entry
│   ├── routes/           # API endpoints
│   │   ├── recipes.ts    # 7 endpoints
│   │   └── auth.ts       # 4 endpoints
│   ├── middleware/       # Auth + Errors
│   └── lib/              # Prisma client
│
├── prisma/
│   ├── schema.prisma     # 9 models
│   └── seed.ts          # Initial data
│
└── .github/skills/       # Documentation
```

---

## 🌐 API Endpoints

### Recipes
- `GET /api/recipes` - רשימה (+ filters, sorting)
- `GET /api/recipes/:id` - מתכון בודד
- `POST /api/recipes` - יצירה
- `PUT /api/recipes/:id` - עדכון
- `DELETE /api/recipes/:id` - מחיקה
- `POST /api/recipes/:id/like` - toggle like
- `POST /api/recipes/parse` - AI parsing

### Auth
- `POST /api/auth/register` - הרשמה
- `POST /api/auth/login` - התחברות
- `GET /api/auth/me` - פרטי משתמש
- `PUT /api/auth/me/preferences` - עדכון העדפות

**תיעוד מלא:** [API Documentation](PROJECT_STATUS.md#-api-endpoints-express)

---

## 📊 Database Schema

9 מודלים ב-Prisma:
- **User** - משתמשים
- **Recipe** - מתכונים
- **Ingredient** - מרכיבים (global)
- **RecipeIngredient** - קשר מתכון↔מרכיב
- **Instruction** - הוראות הכנה
- **RecipeImage** - תמונות
- **Category** - קטגוריות
- **RecipeLike** - לייקים
- **UserPreferences** - העדפות

**קרא עוד:** [Prisma Database Skill](.github/skills/prisma-database/SKILL.md)

---

## 🧪 Scripts

```bash
npm run dev              # Client + Server (concurrently)
npm run dev:client       # Vite only
npm run dev:server       # Express only
npm run build            # Production build
npm run preview          # Preview production
npm run lint             # ESLint
npm run type-check       # TypeScript check
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Prisma Studio GUI
```

---

## 🔐 Environment Variables

```bash
# .env
DATABASE_URL="postgresql://user:pass@localhost:5432/recipes"
JWT_SECRET="your-super-secret-key"
CLIENT_URL="http://localhost:3000"
GROQ_API_KEY="gsk_..." # Optional - for AI parsing
```

---

## 📚 תיעוד נוסף

- 📋 **משימות ופיתוח**: [TASKS.md](TASKS.md)
- 📊 **סטטוס מפורט**: [PROJECT_STATUS.md](PROJECT_STATUS.md)
- 📖 **הוראות SPA**: [README.SPA.md](README.SPA.md)
- 🎓 **Skills**:
  - [Scaling Algorithms](.github/skills/scaling-algorithms/SKILL.md)
  - [Prisma Database](.github/skills/prisma-database/SKILL.md)
  - [Zod Validation](.github/skills/zod-validation/SKILL.md)
  - [UI Design (Chakra)](.github/skills/recipe-ui-design/SKILL.md)

---

## 🎯 סטטוס נוכחי

**הושלם (70%):**
- ✅ Backend מלא - Express + Prisma + JWT
- ✅ 9 API endpoints
- ✅ 4 אלגוריתמי Scaling + המרות
- ✅ AI Recipe Parsing (Groq)
- ✅ 10 UI pages (React Router)
- ✅ Zod validation
- ✅ TypeScript strict mode (0 errors)

**נותר:**
- ⬜ useAuth Context + Hook
- ⬜ Error Boundaries
- ⬜ Tests (vitest)
- ⬜ Performance optimizations

---

## 🤝 Contributing

Pull requests מתקבלים בברכה! לפני שליחת PR:

1. `npm run type-check` - ללא שגיאות
2. `npm run lint` - ללא errors (warnings מותר)
3. `npm run build` - עובר בהצלחה

---

## 📄 License

MIT

---

## 💡 דוגמה - שינוי כמויות

```typescript
import { scaleIngredient } from './src/lib/scaling';

// מתכון ל-4 מנות → שינוי ל-8
const flour = scaleIngredient(
  { amount: 200, unit: 'גרם', scalingRule: 'linear' },
  4,  // original servings
  8   // target servings
);
// Result: 400 גרם (200 × 2)

const yeast = scaleIngredient(
  { amount: 7, unit: 'גרם', scalingRule: 'logarithmic' },
  4,
  8
);
// Result: 8.75 גרם (7 × 1.25) - לא 14!
```

**למה לא פשוט x2?** כי שמרים פועלים בצורה לא לינארית - הכפלה פשוטה תגרום לעלייה מהירה מדי ותקלקל את המתכון.

---

**Built with ❤️ for home chefs and bakers**
