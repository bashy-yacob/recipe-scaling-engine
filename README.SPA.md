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
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Routing

All routes are defined in `src/router.tsx` using React Router's `createBrowserRouter`:

| Path | Page | Description |
|------|------|-------------|
| `/` | HomePage | Landing page |
| `/recipes` | RecipeListPage | List all recipes |
| `/recipes/new` | RecipeCreatePage | Create new recipe |
| `/recipes/:id` | RecipeDetailsPage | View recipe details |
| `/recipes/:id/edit` | RecipeEditPage | Edit existing recipe |
| `/auth/login` | LoginPage | User login |
| `/auth/register` | RegisterPage | User registration |
| `/settings` | SettingsPage | User settings |
| `/demo` | DemoPage | UI component showcase |

## Scaling Algorithms

The app supports 4 scaling rules for ingredients:

- **linear** - Standard proportional scaling (flour, sugar)
- **logarithmic** - Slower growth for potent ingredients (yeast, chocolate)
- **sqrt** - Square root scaling (salt, spices)
- **fixed** - No scaling (vanilla extract, food coloring)

## API Integration

The SPA communicates with a backend API. Configure the API URL via environment variable:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

## Hebrew/RTL Support

- All UI text is in Hebrew
- RTL direction is set globally
- Uses `marginStart`/`marginEnd` for logical properties

## License

MIT
