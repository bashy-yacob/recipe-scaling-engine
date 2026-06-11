# 📊 סטטוס פרויקט Recipe Scaling Engine
**עדכון אחרון: 12 פברואר 2026** | **סטטוס: 🔄 SPA בפיתוח (75%)**

---

## 🏗️ ארכיטקטורה
**Frontend**: Vite + React 19 + TypeScript (SPA)  
**Backend**: Express + Node.js  
**Database**: Prisma + PostgreSQL  
**Deployment**: (בהמתנה - כרגע פיתוח מקומי)

---

## 🎯 סיכום מהיר - סטטוס נוכחי

### ✅ מה עובד מקצה לקצה:
| רכיב | סטטוס | פירוט |
|------|--------|-------|
| 🏗️ **Build & Dev** | ✅ | Vite, TypeScript 5.9, React 19, Turbopack |
| 🗄️ **Database** | ✅ | Prisma 7.2 + PostgreSQL (SQLite בפיתוח) |
| ☁️ **Hosting** | ⬜ | (בהמתנה) |
| ⚖️ **Scaling Algorithms** | ✅ | linear, logarithmic, sqrt, fixed |
| 📐 **Unit Conversions** | ✅ | metric + imperial |
| 💾 **CRUD Operations** | ✅ | Backend מלא: create, read, update, delete |
| 🌐 **API Routes** | ✅ | 9 endpoints פעילים (Express) |
| 📄 **UI Pages** | ✅ | 10 דפים ראשיים (React Router) |
| � **UI/UX Redesign** | ✅ | Semantic tokens, Dark mode, Framer Motion |
| 🌙 **Dark Mode** | ✅ | Toggle + localStorage + semantic tokens |
| 🎨 **Design System** | ✅ | Custom theme + semantic colors |
| 📲 **תפריט מובייל** | ✅ | AnimatePresence drawer |
| 📴 **Loading States** | ✅ | Skeleton loading בכל הדפים |
| �🔔 **Toaster** | ✅ | התראות Chakra UI |
| 🔐 **Authentication** | 🔄 | Backend: ✅ JWT | Frontend: ⬜ hooks חסרים |
| ⚠️ **Error Boundaries** | ⬜ | לא מומש |
| ⚙️ **Settings Page** | 🔄 | UI קיים, API חלקי |
| 🤖 **AI Recipe Parsing** | ✅ | Groq SDK - POST /api/recipes/parse |
| 📝 **Zod Validation** | ✅ | סכמות בצד לקוח ושרת |
| 🔒 **מתכונים פרטיים** | ✅ | isPublic במסד נתונים |
| ❤️ **מערכת לייקים** | ✅ | POST /api/recipes/:id/like |
| 🔍 **סינון מתכונים** | ✅ | לפי קושי, קטגוריה, זמן |
| 📊 **מיון מתכונים** | ✅ | תאריך, שם, זמן, מנות, לייקים |
| 🧪 **Tests** | ⬜ | לא נכתבו עדיין |

### 📈 אחוז השלמה: **~75%** 🔄

---

## 🛠️ Stack טכנולוגי

### Frontend (SPA)
| טכנולוגיה | גרסה | שימוש |
|-----------|-------|-------|
| Vite | 6.4.1 | Build tool + Dev server |
| React | 19.2.3 | UI Library |
| React Router | 6.x | Client-side routing |
| TypeScript | 5.9 | Type Safety (strict mode) |
| Chakra UI | 3.31.0 | Component Library |
| Framer Motion | 12.28.1 | Animations |
| Lucide React | 0.562.0 | Icons |
| React Hook Form | 7.x | Form management |

### Backend (Express)
| טכנולוגיה | גרסה | שימוש |
|-----------|-------|-------|
| Express | 5.2.1 | Web server |
| Prisma | 7.2.0 | ORM |
| PostgreSQL | Latest | Database (Production) |
| SQLite | - | Database (Development) |
| jsonwebtoken | 9.0.3 | JWT Authentication |
| bcryptjs | 3.0.3 | Password Hashing |
| Zod | 4.3.5 | Validation |
| Groq SDK | Latest | AI Recipe Parsing |
| tsx | Latest | TypeScript execution |
| concurrently | Latest | Run client + server |

---

## ✅ תוצאות Build אחרון (12.2.2026)

```bash
✓ TypeScript check passed (0 errors)
✓ ESLint passed (0 errors)
✓ Vite build successful
✓ Prisma Client generated

dist/index.html                 0.77 kB │ gzip: 0.43 kB
dist/assets/index.css           0.35 kB │ gzip: 0.25 kB
dist/assets/index.js        1,312.82 kB │ gzip: 350.09 kB
```

⚠️ Bundle size גדול - יש לשקול code splitting

---

## 📁 מבנה הפרויקט

```
recipe-scaling-engine/
├── src/                    # Frontend (Vite SPA)
│   ├── main.tsx           # Entry point + ColorModeProvider
│   ├── App.tsx            # Root component (semantic bg)
│   ├── router.tsx         # Routes config
│   ├── theme.ts           # ⭐ Custom theme + semantic tokens + dark mode
│   ├── pages/             # 10 page components
│   ├── hooks/
│   │   ├── useAuth.tsx     # Auth context + JWT
│   │   └── useColorMode.tsx # ⭐ Dark/Light mode context
│   ├── components/        # Reusable UI
│   │   ├── shared/        # Navbar, Footer, ImageUploader
│   │   └── ui/            # toaster, color-mode-toggle
│   ├── lib/              # Business logic
│   │   ├── api/          # API client
│   │   ├── scaling/      # Algorithms
│   │   └── validations/  # Zod schemas
│   └── types/            # TypeScript types
│
├── server/                # Backend (Express)
│   ├── index.ts          # Server entry
│   ├── routes/           # API endpoints
│   │   ├── recipes.ts    # 6 recipe routes
│   │   └── auth.ts       # 4 auth routes
│   ├── middleware/       # Auth + Errors
│   └── lib/              # Prisma client
│
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts          # Initial data
│
└── public/               # Static assets
```
| `/api/user/settings` | Dynamic | הגדרות API |

---

## 📁 מבנה הפרויקט

```
recipe-scaling-engine/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts  # NextAuth handlers
│   │   │   └── register/route.ts       # הרשמה (60 שורות)
│   │   ├── recipes/
│   │   │   ├── route.ts                # GET/POST + סינון/מיון (95 שורות)
│   │   │   ├── [id]/route.ts           # GET/PUT/DELETE (70 שורות)
│   │   │   ├── [id]/like/route.ts      # GET/POST likes (95 שורות)
│   │   │   └── parse/route.ts          # AI parsing (83 שורות)
│   │   └── user/settings/route.ts      # GET/PUT (90 שורות)
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── error/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── Providers.tsx
│   │   ├── ingredients/               # ריק - לעתיד
│   │   └── recipes/
│   │       ├── page.tsx               # 322 שורות - רשימה + חיפוש
│   │       ├── new/page.tsx           # 538 שורות - יצירה + AI
---

## ⭐ UI Redesign (12.2.2026)

### מה השתנה:
- **Design System**: Semantic tokens מלאים עם dark/light mode — אפס צבעים hardcoded
- **Dark Mode**: Toggle + localStorage + `.dark` class על `<html>`
- **צבעים**: Orange primary (#f97316) + Slate Blue secondary (#6B7DB8)
- **אנימציות**: Framer Motion — fade-in, stagger, whileInView
- **Loading**: Skeleton במקום Spinner בכל הדפים
- **סגנון**: Minimal & Clean — outline cards, `borderRadius="lg"`, פחות רווחים

### קבצים שנוצרו:
- `src/theme.ts` — מערכת עיצוב מלאה (semantic tokens, brand/slate_blue palettes)
- `src/hooks/useColorMode.tsx` — Color mode context + provider
- `src/components/ui/color-mode-toggle.tsx` — Sun/Moon toggle button

### קבצים שעודכנו (15 קבצים):
- `main.tsx`, `App.tsx`, `globals.css`
- `Navbar.tsx`, `Footer.tsx`, `ImageUploader.tsx`
- `HomePage.tsx`, `LoginPage.tsx`, `RegisterPage.tsx`
- `RecipeListPage.tsx`, `RecipeDetailsPage.tsx`
- `RecipeCreatePage.tsx`, `RecipeEditPage.tsx`
- `SettingsPage.tsx`, `DemoPage.tsx`
- `ErrorPage.tsx`, `NotFoundPage.tsx`

---

## 🌐 API Endpoints (Express)

### Recipes
| Method | Endpoint | Auth | תיאור |
|--------|----------|------|-------|
| GET | `/api/recipes` | Optional | רשימת מתכונים + filters + sorting |
| GET | `/api/recipes/:id` | Optional | מתכון בודד עם כל הפרטים |
| POST | `/api/recipes` | Required | יצירת מתכון חדש |
| PUT | `/api/recipes/:id` | Required | עדכון מתכון |
| DELETE | `/api/recipes/:id` | Required | מחיקת מתכון |
| POST | `/api/recipes/:id/like` | Required | Toggle like |
| POST | `/api/recipes/parse` | Required | AI parsing של טקסט למתכון |

### Auth
| Method | Endpoint | Auth | תיאור |
|--------|----------|------|-------|
| POST | `/api/auth/register` | - | הרשמת משתמש חדש |
| POST | `/api/auth/login` | - | התחברות + JWT |
| GET | `/api/auth/me` | Required | פרטי המשתמש המחובר |
| PUT | `/api/auth/me/preferences` | Required | עדכון העדפות |

### Health
| Method | Endpoint | Auth | תיאור |
|--------|----------|------|-------|
| GET | `/api/health` | - | בדיקת תקינות השרת |

---

## 📄 Frontend Routes (React Router)

| Route | Component | תיאור |
|-------|-----------|-------|
| `/` | HomePage | דף הבית |
| `/recipes` | RecipeListPage | רשימת מתכונים |
| `/recipes/:id` | RecipeDetailsPage | צפייה + scaling |
| `/recipes/new` | RecipeCreatePage | יצירת מתכון + AI |
| `/recipes/:id/edit` | RecipeEditPage | עריכת מתכון |
| `/auth/login` | LoginPage | התחברות |
| `/auth/register` | RegisterPage | הרשמה |
| `/settings` | SettingsPage | הגדרות משתמש |
| `/demo` | DemoPage | דף הדגמה |
| `*` | NotFoundPage | 404 |

---

## 🔐 Authentication Flow (JWT)

```
┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│   Register/  │────▶│   Express   │────▶│  JWT Token   │
│    Login     │     │  + bcrypt   │     │ in Storage   │
└──────────────┘     └─────────────┘     └──────────────┘
                                                 │
                                                 ▼
                                        ┌──────────────┐
                                        │  Protected   │
                                        │  API Calls   │
                                        └──────────────┘
```

---

## 📊 Database Schema (Prisma)

### Models (9):
- **User** - משתמשים
- **Recipe** - מתכונים  
- **Ingredient** - מרכיבים (global)
- **RecipeIngredient** - קשר מתכון ↔ מרכיב
- **Instruction** - הוראות הכנה
- **RecipeImage** - תמונות
- **Category** - קטגוריות
- **RecipeLike** - לייקים
- **UserPreferences** - העדפות משתמש

---

## ⚡ Performance & Optimizations

### ✅ נעשה:
- [x] TypeScript strict mode
- [x] Vite build optimization
- [x] Prisma Client singleton
- [x] JWT validation middleware
- [x] Zod validation (client + server)
- [x] Semantic token design system
- [x] Dark mode support
- [x] Framer Motion animations
- [x] Loading skeletons

### ⬜ נדרש:
- [ ] React.memo() על components
- [ ] Code splitting (dynamic imports)
- [ ] Image optimization
- [ ] API response caching
- [ ] Database connection pooling

---

## 🔬 קבצים עיקריים

### Backend
```
server/
├── index.ts                    # 50 שורות - Express setup
├── routes/
│   ├── recipes.ts             # 660 שורות - 7 endpoints
│   └── auth.ts                # 150 שורות - 4 endpoints
├── middleware/
│   ├── auth.ts                # 74 שורות - JWT
│   └── errors.ts              # 73 שורות - Error handling
└── lib/prisma.ts              # 15 שורות - Client
```

### Frontend
```
src/
├── main.tsx                   # Entry point
├── router.tsx                 # React Router config
├── pages/
│   ├── recipes/
│   │   ├── RecipeListPage.tsx        # רשימה + סינון
│   │   ├── RecipeDetailsPage.tsx     # צפייה + scaling
│   │   ├── RecipeCreatePage.tsx      # יצירה + AI
│   │   └── RecipeEditPage.tsx        # עריכה
│   └── auth/
│       ├── LoginPage.tsx
│       └── RegisterPage.tsx
├── lib/
│   ├── scaling/
│   │   ├── algorithms.ts      # 216 שורות ⭐
│   │   └── conversions.ts     # 190 שורות
│   ├── api/
│   │   ├── recipes.ts         # API client
│   │   └── config.ts          # Axios setup
│   └── validations/
│       └── recipe.ts          # Zod schemas
└── types/recipe.ts            # TypeScript types
```

---

## 🚀 Scripts זמינים

```bash
npm run dev              # Client + Server (concurrently)
npm run dev:client       # Vite only (port 3000)
npm run dev:server       # Express only (port 3001)
npm run build            # Production build
npm run preview          # Preview production build
npm run lint             # ESLint check
npm run type-check       # TypeScript check
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Prisma Studio GUI
```

---

## ⚖️ Scaling Algorithms

הפיצ'ר המרכזי של הפרויקט - 4 אלגוריתמים חכמים:

| Algorithm | שימוש | נוסחה | דוגמה (4→8 מנות) |
|-----------|--------|-------|-------------------|
| `linear` | קמח, סוכר, מים, ביצים | `amount * ratio` | 200g × 2 = 400g |
| `logarithmic` | שמרים, אבקת אפייה, קקאו | `amount * (1 + log(ratio)/log(4))` | 7g × 1.25 = 8.75g |
| `sqrt` | מלח, תבלינים, שום | `amount * sqrt(ratio)` | 5g × 1.41 = 7g |
| `fixed` | ווניל, קישוט, ציפוי | `amount` (קבוע) | 1 tsp = 1 tsp |

**קוד:** [lib/scaling/algorithms.ts](src/lib/scaling/algorithms.ts) (216 שורות)

---

## 🔄 Unit Conversions

המרות בין מערכות מדידה:

**Metric ↔ Imperial:**
- גרמים ↔ אונקיות
- מ"ל ↔ כוסות/כפות
- צלזיוס ↔ פרנהייט

**קוד:** [lib/scaling/conversions.ts](src/lib/scaling/conversions.ts) (190 שורות)

---

## 🤖 AI Recipe Parsing (Groq)

פענוח טקסט חופשי למתכון מובנה:

```typescript
POST /api/recipes/parse
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

{
  "text": "עוגת שוקולד ל-8 מנות\n\nמרכיבים:\n200 גרם קמח\n7 גרם שמרים\n..."
}

// Response:
{
  "success": true,
  "data": {
    "title": "עוגת שוקולד",
    "servings": 8,
    "ingredients": [
      { "name": "קמח", "amount": 200, "unit": "גרם", "scalingRule": "linear" },
      { "name": "שמרים", "amount": 7, "unit": "גרם", "scalingRule": "logarithmic" }
    ],
    "instructions": [...]
  }
}
```

**Scaling Rules נקבעים אוטומטית על ידי AI**

---

## 📋 מה נותר לעשות?

### 🔴 קריטי (בעדיפות גבוהה):
- [ ] **Error Boundaries** - טיפול בשגיאות React

### 🟡 חשוב (בעדיפות בינונית):
- [ ] **Settings API Integration** - חיבור עמוד ההגדרות ל-API
- [ ] **React.memo()** - אופטימיזציה של RecipeCard
- [ ] **Code Splitting** - dynamic imports למהירות

### 🟢 רצוי (עתיד):
- [ ] **Tests** - vitest + testing-library
- [ ] **Image Upload** - העלאת תמונות למתכונים
- [ ] **Advanced Search** - חיפוש מתקדם לפי מרכיבים
- [ ] **Tags System** - תיוג מתכונים
- [ ] **PWA** - Progressive Web App

---

## 📊 סטטיסטיקות קוד (פברואר 2026)

| קטגוריה | קבצים | שורות קוד | תיאור |
|----------|-------|-----------|-------|
| **Backend** | 5 | ~950 | Express server + middleware |
| **API Routes** | 2 | ~810 | 9 endpoints (recipes + auth) |
| **Frontend Pages** | 10 | ~2,500 | React components |
| **Business Logic** | 4 | ~600 | Scaling + validations |
| **Database** | 2 | ~1,050 | Prisma schema + seed |
| **Types & Config** | 5 | ~300 | TypeScript definitions |
| **סה"כ** | **28** | **~6,210** | קוד פעיל (בלי node_modules) |

---

## 🎯 מדדי איכות

| בדיקה | תוצאה | סטטוס |
|-------|--------|-------|
| **TypeScript** | 0 errors | ✅ |
| **ESLint** | 0 errors | ✅ |
| **Build** | Success (1.31MB) | ✅ |
| **Prisma Client** | Generated | ✅ |
| **Tests** | Not implemented | ⬜ |

---

## 💡 הערות טכניות

### Bundle Size
⚠️ Bundle גדול (1.15MB) - צריך code splitting:
```javascript
// המלצה: dynamic imports
const RecipeCreatePage = lazy(() => import('./pages/recipes/RecipeCreatePage'));
```

### Database
- **Development**: SQLite (local)
- **Production**: PostgreSQL (מומלץ Neon/Supabase)

### Environment Variables
```bash
DATABASE_URL=          # PostgreSQL connection string
JWT_SECRET=            # Secret for JWT tokens
CLIENT_URL=            # Frontend URL (CORS)
GROQ_API_KEY=         # Groq AI API key (optional)
```

---

## 🚀 הפעלה מקומית

```bash
# 1. Clone + Install
git clone <repo-url>
cd recipe-scaling-engine
npm install

# 2. Setup Database
cp .env.example .env
# ערוך .env עם DATABASE_URL שלך
npx prisma generate
npx prisma db push
npx prisma db seed

# 3. Run Development
npm run dev
# Client: http://localhost:3000
# Server: http://localhost:3001

# 4. Build Production
npm run build
npm run preview
```

---

## 📚 קישורים נוספים

- **README עיקרי**: [README.SPA.md](README.SPA.md)
- **משימות**: [TASKS.md](TASKS.md)
- **הוראות פיתוח**: [.github/instructions/new.instructions.md](.github/instructions/new.instructions.md)
- **Skills**: [.github/skills/](.github/skills/)

---

**🎯 סטטוס נוכחי: 75% מוכן | Backend מושלם ✅ | UI Redesign הושלם ✅ | נותר: Tests + Error Boundaries**

**📅 עדכון אחרון: 12 פברואר 2026**

---

## 🏆 סיכום הישגים

✅ **UI Redesign**: Semantic tokens, Dark mode, Framer Motion, Minimal & Clean  
✅ **Backend מושלם**: Express + Prisma + JWT + 9 API endpoints  
✅ **Scaling Engine**: 4 אלגוריתמים חכמים + המרות יחידות  
✅ **AI Integration**: Groq SDK לפענוח מתכונים מטקסט  
✅ **UI מלא**: 10 דפים עם Chakra UI v3 + Dark Mode  
✅ **Validation**: Zod schemas בצד לקוח ושרת  
✅ **TypeScript Strict**: אפס שגיאות קומפילציה  

🔄 **נותר**: Error Boundaries, Tests, Optimizations
