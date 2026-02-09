## Recipe Scaling Engine — AI coding instructions

Purpose: help an AI contributor (Copilot/agent) be productive immediately in this repo.

- **Big picture**: Next.js (App Router) frontend + API routes under `app/api/*`, Prisma-backed DB via `lib/db.ts` and `prisma/schema.prisma`. Core domain logic lives in `lib/` (CRUD in `lib/recipes/*`, scaling in `lib/scaling/*`, validation in `lib/validations/*`). UI pages inside `app/dashboard/recipes/*` use these libs.

- **Key files to read first**:
  - `lib/scaling/algorithms.ts` — canonical scaling math and `roundForCooking()` examples.
  - `lib/scaling/conversions.ts` — unit conversions and helpers (`gramsToCups`, `convertUnits`).
  - `lib/validations/recipe.ts` — Zod schemas used before DB writes.
  - `lib/recipes/create.ts` and `lib/recipes/read.ts` — how API layer calls DB and shapes relations (uses `upsert`, `include`, and nested `create`).
  - `app/api/recipes/route.ts` — example of filtering, sorting, auth checks and how responses are shaped.
  - `prisma/schema.prisma` — authoritative model shapes (Recipe, Ingredient, RecipeIngredient, RecipeLike, etc.).

- **Data flow / boundaries**:
  - UI pages call API routes in `app/api/*`.
  - API handlers use `lib/*` helpers (validation → business logic → `db` via Prisma). Keep this direction: pages → API → lib → db.
  - Validation: call `recipeSchema.parse()` (from `lib/validations/recipe.ts`) before any DB create/update.

- **Project-specific conventions**:
  - TypeScript strict mode: avoid `any`. Use existing interfaces in `types/recipe.ts` and Zod types.
  - Always use `include` when fetching relations from Prisma (see `lib/recipes/*`).
  - UI text is Hebrew and layout is RTL; when editing components check `app/layout.tsx` and pages under `app/*` for `dir="rtl"` patterns.
  - Scaling rules: `linear`, `logarithmic`, `sqrt`, `fixed` — logic lives in `lib/scaling/algorithms.ts`. Use `getDefaultScalingRule()` to infer rules when parsing/creating ingredients.
  - Rounding rules for cooking are in `roundForCooking()` — prefer using the helper rather than ad-hoc rounding.

- **Integration points**:
  - Authentication: NextAuth config in `lib/auth.ts` and API handlers call `auth()` for session checks (see `app/api/recipes/route.ts`).
  - DB: Prisma client generated and used via `lib/db.ts`; migrations and `prisma generate` are required before build.
  - AI parsing: `app/api/recipes/parse` uses the Groq SDK; follow existing shape returned by that route when adding parsing functionality.

- **Build / dev commands (verified in repo)**:
  - `npm run dev` — local development
  - `npm run build` — runs `prisma generate` then `next build`
  - `npx tsc --noEmit` — type checks
  - Prisma: `npx prisma generate`, `npx prisma db push`, `npx prisma studio`

- **Examples / idioms to follow**:
  - Create recipe: `lib/recipes/create.ts` — validate with `recipeSchema.parse`, upsert ingredients, then `db.recipe.create({ data: { ..., recipeIngredients: { create: [...] } } })` with `include` for relations.
  - Fetch recipes: `lib/recipes/read.ts` and `app/api/recipes/route.ts` show filter building, `orderBy`, and post-processing (like resolving `isLiked` using `recipeLike`). Mirror this pattern for new list endpoints.
  - Scaling usage: call `scaleIngredient()` or `scaleRecipe()` from `lib/scaling/algorithms.ts` and present `scaleIngredientRounded()` for UX-friendly amounts.

- **Formatting, commits & PRs**:
  - Commit messages in Hebrew (imperative): e.g. `הוסף: [feature]`, `תקן: [bug]`, `שפר: [improvement]`.
  - Keep changes focused and avoid touching unrelated files.

- **What not to change without explicit check**:
  - Prisma models in `prisma/schema.prisma` (DB migrations required).
  - Auth flows in `lib/auth.ts` and `app/api/auth/*` (sensitive; run manual checks).

If anything above is unclear or you want the file to include additional examples (tests, CI, or deeper API contract samples), tell me which section to expand.
