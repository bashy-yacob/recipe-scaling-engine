# 📋 תוכנית עבודה - Recipe Scaling Engine

> תאריך עדכון: 12.2.2026 | סטטוס: Backend מושלם ✅ | UI Redesign הושלם ✅

---

## ✅ שלב 1: Backend עם Express (הושלם)

### 1.1 הקמת שרת ✅
- [x] יצירת תיקיית `server/` עם המבנה הנדרש
- [x] התקנת dependencies: express, cors, dotenv, jsonwebtoken, bcryptjs, tsx, concurrently
- [x] העברת prisma מ-optionalDependencies ל-dependencies
- [x] יצירת `server/tsconfig.json`

### 1.2 Prisma Setup ✅
- [x] יצירת קובץ `.env` עם `DATABASE_URL`
- [x] הרצת `prisma migrate dev --name init`
- [x] הרצת `prisma generate`
- [x] הרצת seed להזנת מרכיבים בסיסיים
- [x] יצירת `server/lib/prisma.ts` — Prisma client singleton

### 1.3 API Routes — 9 endpoints ✅
- [x] `GET /api/recipes` — רשימה עם filters + sorting
- [x] `GET /api/recipes/:id` — מתכון בודד עם relations
- [x] `POST /api/recipes` — יצירת מתכון עם Zod validation
- [x] `PUT /api/recipes/:id` — עדכון מתכון
- [x] `DELETE /api/recipes/:id` — מחיקת מתכון
- [x] `POST /api/recipes/:id/like` — toggle like
- [x] `POST /api/recipes/parse` — פענוח טקסט חופשי (AI)
- [x] `GET /api/health` — health check
- [x] Error handling middleware

### 1.4 חיבור Frontend ↔ Backend ✅
- [x] הוספת proxy ב-`vite.config.ts`: `/api` → `http://localhost:3001`
- [x] הוספת scripts: `dev:server`, `dev:client`, `dev` (concurrently)
- [x] בדיקה ידנית

---

## ✅ שלב 2: אימות משתמשים (הושלם)

### 2.1 Auth Routes בשרת ✅
- [x] `POST /api/auth/register` — bcrypt hash + JWT
- [x] `POST /api/auth/login` — credentials + JWT
- [x] `GET /api/auth/me` — פרטי משתמש
- [x] `PUT /api/auth/me/preferences` — עדכון העדפות

### 2.2 Auth Middleware ✅
- [x] JWT verification middleware (`requireAuth`, `optionalAuth`)
- [x] הגנה על routes שדורשים אימות
- [x] Routes ציבוריים

### 2.3 Frontend Auth ✅
- [x] יצירת `src/lib/api/auth.ts`
- [x] יצירת `src/hooks/useAuth.tsx` — React context + hook
- [x] עדכון `config.ts` — Authorization header אוטומטי
- [x] עדכון `Navbar.tsx` — useAuth() במקום hardcoded
- [x] `LoginPage.tsx` — UI מוכן
- [x] `RegisterPage.tsx` — UI מוכן
- [x] שמירת token ב-localStorage + auto-login

---

## ✅ שלב 3: חיבור Scaling + Validation (הושלם)

### 3.1 Scaling אמיתי ב-UI ✅
- [x] עדכון `RecipeDetailsPage.tsx` — שימוש ב-`scaleIngredient()` 
- [x] תיקון `roundForCooking` לפי SKILL.md
- [x] 4 אלגוריתמי scaling: linear, logarithmic, sqrt, fixed

### 3.2 Zod Validation בטפסים ✅
- [x] עדכון `RecipeCreatePage.tsx` — react-hook-form + zod
- [x] עדכון `RecipeEditPage.tsx` — react-hook-form + zod
- [x] Zod validation בצד שרת (`server/routes/recipes.ts`)
- [x] הודעות שגיאה בעברית

### 3.3 שדות חסרים בטפסים (חלקי)
- [x] selector ל-difficulty
- [x] selector ל-category
- [ ] scaling rule selector לכל מרכיב (ברירת מחדל עובדת)

---

## 🔄 שלב 4: השלמת UI/UX (הושלם)

- [x] תפריט מובייל (Drawer ב-Navbar) ✅
- [x] Settings Page נוצרה ✅
- [ ] Settings שמירה אמיתית ל-API
- [x] עדכון דף הבית ✅
- [ ] Error Boundaries
- [ ] React.memo() על RecipeCard
- [x] Chakra UI props (רוב הקוד נקי) ✅

### 4.5 UI Redesign ✅ (12.2.2026)
- [x] מערכת עיצוב מלאה — `src/theme.ts` (semantic tokens, brand + slate_blue palettes)
- [x] Dark Mode — `useColorMode` hook + `ColorModeProvider` + toggle button
- [x] Framer Motion אנימציות — fade-in, stagger, whileInView
- [x] Loading Skeletons — בכל הדפים במקום Spinner
- [x] Navbar — AnimatePresence mobile drawer + dark mode toggle
- [x] Footer — עיצוב נקי + semantic tokens
- [x] כל 10 דפים עודכנו — semantic tokens, outline cards, `borderRadius="lg"`
- [x] ImageUploader — semantic tokens
- [x] הסרת כל הצבעים ה-hardcoded (`gray.50`, `orange.500`, `#hex`)
- [x] הסרת `style={{ marginLef- [x] Build עובר (0 errors)
t }}` — הוחלף ב-`ms={}`

---

## ⬜ שלב 5: בדיקות (טרם התחיל)

### 5.1 Setup
- [ ] התקנת vitest, testing-library, happy-dom
- [ ] יצירת config files

### 5.2 Unit Tests
- [ ] algorithms.test.ts — 4 אלגוריתמים + roundForCooking
- [ ] conversions.test.ts — המרות יחידות
- [ ] recipe.test.ts — Zod schemas

### 5.3 API + Component Tests
- [ ] recipes.test.ts — CRUD endpoints
- [ ] auth.test.ts — register, login
- [ ] ImageUploader.test.tsx
- [ ] RecipeDetailsPage.test.tsx

---

## שלב 6: סיום (יום 7)

- [ ] עדכון PROJECT_STATUS.md
- [ ] npm run build עובר
- [ ] npm test עובר
- [ ] בדיקה ידנית מלאה
- [ ] עדכון vercel.json + README.md

---

## מעקב התקדמות

| שלב | סטטוס | תאריך סיום | אחוז |
|------|--------|------------|------|
| 1. Backend | ✅ הושלם | 11.2.2026 | 100% |
| 2. Auth | ✅ הושלם | 11.2.2026 | 100% |
| 3. Scaling + Validation | ✅ הושלם | 11.2.2026 | 95% |
| 4. UI/UX + Redesign | ✅ הושלם | 12.2.2026 | 95% |
| 5. בדיקות | ⬜ טרם התחיל | | 0% |
| 6. סיום | ⬜ טרם התחיל | | 0% |

**🎯 התקדמות כללית: ~80%**

---

## ✅ מה עובד עכשיו:
- ✅ Express Server + Prisma
- ✅ 9 API endpoints מלאים
- ✅ Auth (register, login, JWT)
- ✅ CRUD מתכונים
- ✅ Scaling algorithms (4 types)
- ✅ Unit conversions
- ✅ Zod validation (client + server)
- ✅ Recipe parsing עם AI (Groq)
- ✅ Chakra UI v3 components
- ✅ React Router v6
- ✅ TypeScript (strict mode)
- ✅ useAuth hook + Context + auto-login
- ✅ UI Redesign (semantic tokens + dark mode + animations)
- ✅ Loading skeletons
- ✅ Framer Motion (fade-in, stagger, whileInView)

## 🔄 נדרש עוד:
- [ ] Error Boundaries
- [ ] Tests (unit + integration)
- [ ] Performance optimizations (React.memo, code splitting)
- [ ] Settings API integration

