# Recipe Scaling Engine - SPA

Smart recipe scaling system built with Vite + React + TypeScript.

## Tech Stack

- **Framework**: Vite + React 19
- **Routing**: React Router v6
- **UI Library**: Chakra UI v3
- **Validation**: Zod
- **Language**: TypeScript (strict mode)
- **Database**: Prisma (backend only)

## Project Structure

```
src/
├── main.tsx                 # App entry point
├── App.tsx                  # Root layout component
├── router.tsx               # Centralized routing configuration
├── vite-env.d.ts           # Vite type definitions
│
├── pages/                   # Page components (route views)
│   ├── HomePage.tsx
│   ├── NotFoundPage.tsx
│   ├── ErrorPage.tsx
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── recipes/
│   │   ├── RecipeListPage.tsx
│   │   ├── RecipeDetailsPage.tsx
│   │   ├── RecipeCreatePage.tsx
│   │   └── RecipeEditPage.tsx
│   ├── settings/
│   │   └── SettingsPage.tsx
│   └── demo/
│       └── DemoPage.tsx
│
├── components/              # Reusable UI components
│   ├── shared/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ImageUploader.tsx
│   └── ui/
│       └── toaster.tsx
│
├── lib/                     # Business logic & utilities
│   ├── api/                 # API client functions
│   │   ├── config.ts
│   │   ├── recipes.ts
│   │   └── upload.ts
│   ├── scaling/             # Recipe scaling algorithms
│   │   ├── algorithms.ts
│   │   └── conversions.ts
│   └── validations/         # Zod schemas
│       └── recipe.ts
│
├── types/                   # TypeScript type definitions
│   └── recipe.ts
│
└── styles/                  # Global styles
    └── globals.css
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
```bash
# Install dependencies
npm install

# Start development server (Client + Server)
npm run dev
```

**Ports:**
- Frontend (Vite): http://localhost:3000
- Backend (Express): http://localhost:3001

### Available Scripts

- `npm run dev` - Start client + server concurrently
- `npm run dev:client` - Vite only (port 3000)
- `npm run dev:server` - Express only (port 3001)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio GUI

## Backend (Express)

The project includes a complete Express backend in `server/`:

```
server/
├── index.ts           # Express server
├── routes/
│   ├── recipes.ts     # 7 recipe endpoints
│   └── auth.ts        # 4 auth endpoints
├── middleware/
│   ├── auth.ts        # JWT authentication
│   └── errors.ts      # Error handling
└── lib/
    └── prisma.ts      # Prisma client
```

**API Base URL:** http://localhost:3001/api

## Routing

All routes are defined in `src/router.tsx` using React Router's `createBrowserRouter`:

| Path | Page | Description |
|------|------|-------------|
| `/` | HomePage | Landing page |
| `/recipes` | RecipeListPage | List all recipes + filters |
| `/recipes/new` | RecipeCreatePage | Create new recipe + AI parsing |
| `/recipes/:id` | RecipeDetailsPage | View recipe + scaling calculator |
| `/recipes/:id/edit` | RecipeEditPage | Edit existing recipe |
| `/auth/login` | LoginPage | User login (JWT) |
| `/auth/register` | RegisterPage | User registration |
| `/settings` | SettingsPage | User settings |
| `/demo` | DemoPage | UI component showcase |

## Scaling Algorithms

The app supports 4 scaling rules for ingredients:

- **linear** - Standard proportional scaling (flour, sugar, water)
- **logarithmic** - Slower growth for potent ingredients (yeast, baking powder)
- **sqrt** - Square root scaling for strong flavors (salt, spices, garlic)
- **fixed** - No scaling for decorative items (vanilla extract, food coloring)

**Example:** Scaling from 4 to 8 servings (ratio = 2):
- Flour (linear): 200g × 2 = 400g
- Yeast (logarithmic): 7g × 1.25 = 8.75g
- Salt (sqrt): 5g × √2 = 7g
- Vanilla (fixed): 1 tsp = 1 tsp

## API Integration

The SPA communicates with the Express backend via Vite proxy:

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
```

### API Client

```typescript
// src/lib/api/recipes.ts
import { apiClient } from './config';

export const recipeAPI = {
  list: () => apiClient.get('/recipes'),
  get: (id: string) => apiClient.get(`/recipes/${id}`),
  create: (data) => apiClient.post('/recipes', data),
  update: (id: string, data) => apiClient.put(`/recipes/${id}`, data),
  delete: (id: string) => apiClient.delete(`/recipes/${id}`),
};
```

## Database

Uses Prisma ORM with 9 models:
- User, Recipe, Ingredient, RecipeIngredient
- Instruction, RecipeImage, Category
- RecipeLike, UserPreferences

**Setup:**

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed initial data
npx prisma db seed

# Open Prisma Studio
npx prisma studio
```

## Hebrew/RTL Support

- All UI text is in Hebrew
- RTL direction set via Chakra UI's `direction="rtl"`
- Uses logical properties: `marginStart`/`marginEnd`, `paddingInlineStart`

## Environment Variables

```bash
# .env
DATABASE_URL="file:./dev.db"              # SQLite for dev
JWT_SECRET="your-secret-key"              # For JWT auth
CLIENT_URL="http://localhost:3000"        # For CORS
GROQ_API_KEY="gsk_..."                    # Optional: AI parsing
```

## License

MIT
