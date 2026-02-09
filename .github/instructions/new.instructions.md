---
applyTo: "**"
---

# Recipe Scaling Engine - Instructions

## Stack
- Next.js 16.1.4 (App Router) + TypeScript 5.9.3 (strict)
- Prisma 7.2.0 + SQLite
- Chakra UI v3
- Zod validation

## Core Concept
**Smart recipe scaling** with 4 algorithm types:
- `linear` - most ingredients (flour, sugar, water)
- `logarithmic` - yeast, chocolate (scales slower)
- `sqrt` - salt, spices (square root scaling)
- `fixed` - vanilla, baking powder (doesn't scale)

## Project Structure
```
lib/
├── scaling/
│   ├── algorithms.ts    # scaleIngredient(), roundForCooking()
│   └── conversions.ts   # gramsToCups(), mlToCups()
├── recipes/
│   ├── create.ts        # createRecipe()
│   ├── read.ts          # getRecipe(), getUserRecipes()
│   ├── update.ts        # updateRecipe()
│   └── delete.ts        # deleteRecipe()
└── validations/
    └── recipe.ts        # Zod schemas

app/
├── api/recipes/         # API routes
└── dashboard/recipes/   # UI pages
```

## Key Interfaces
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
  amount: number;
  unit: string;
  scalingRule: 'linear' | 'logarithmic' | 'sqrt' | 'fixed';
}
```

## Coding Standards

### TypeScript
- Strict mode enabled - no `any`, use explicit types
- Interfaces for data structures
- `const` by default, `?.` and `??` for safety

### React
- Functional components + hooks only
- Hooks at top of component
- Small, focused components
- Use React.memo() for list items

### Naming
- Components: `PascalCase` (RecipeForm)
- Functions: `camelCase` (scaleIngredient)
- Constants: `UPPER_SNAKE_CASE`
- Files: match component name

### Database (Prisma)
- Always use `include` for relations
- Validate with Zod before DB operations
- Handle errors gracefully
```typescript
const recipe = await db.recipe.findUnique({
  where: { id },
  include: { ingredients: true, instructions: true }
});
```

## UI Patterns

### Hebrew/RTL
- All text in Hebrew
- `dir="rtl"` on containers
- Error messages: "שדה חובה", "מספר לא תקין"

### Toast Notifications
```typescript
import { toast } from '@/components/ui/toaster';
toast.success('המתכון נשמר בהצלחה');
toast.error('שגיאה בשמירה');
```

### Loading States
```typescript
if (isLoading) return <Spinner />;
```

## Common Patterns

### Scale Recipe
```typescript
const scaledAmount = scaleIngredient(
  ingredient.amount,
  recipe.servings,
  targetServings,
  ingredient.scalingRule
);
```

### Create Recipe
```typescript
const recipe = await createRecipe(userId, {
  title: 'עוגת שוקולד',
  servings: 8,
  ingredients: [
    { name: 'קמח', amount: 200, unit: 'גרם', scalingRule: 'linear' },
    { name: 'שמרים', amount: 7, unit: 'גרם', scalingRule: 'logarithmic' },
    { name: 'מלח', amount: 1, unit: 'כפית', scalingRule: 'sqrt' }
  ]
});
```

### Validate Data
```typescript
import { recipeSchema } from '@/lib/validations/recipe';
const validated = recipeSchema.parse(formData);
```

## API Format
```typescript
// Success
{ success: true, data: Recipe }

// Error
{ success: false, error: string }
```

## Git Commits (Hebrew)
```
הוסף: [feature]
תקן: [bug]
שפר: [improvement]
```

## Priority
1. Correct scaling math (core feature)
2. Data integrity (validation, error handling)
3. UX improvements (loading, errors, toasts)
4. Advanced features (OCR, web scraping)

## Workflow Rules

### After Every Significant Change
1. **Run validation checks**:
   ```bash
   npm run build        # Ensure build passes
   npm run type-check   # TypeScript errors
   ```

2. **Test affected functionality**:
   - If changed scaling → test all 4 algorithm types
   - If changed DB → test CRUD operations
   - If changed UI → test in browser

3. **Update project status file**:
   - Open `project-status.md` or similar tracking file
   - Update completion percentages
   - Mark completed tasks with ✅
   - Add new issues/bugs discovered
   - Update "Last Updated" timestamp

### Before Committing
- [ ] Build passes without errors
- [ ] No TypeScript errors
- [ ] Affected features tested manually
- [ ] Project status file updated
- [ ] Commit message in Hebrew with clear description

### Git Workflow (After Significant Changes)
1. **Stage changes**:
   ```bash
   git add .
   ```

2. **Commit with descriptive message** (Hebrew):
   ```bash
   git commit -m "הוסף: [תיאור הפיצ'ר]"
   git commit -m "תקן: [תיאור הבאג שתוקן]"
   git commit -m "שפר: [תיאור השיפור]"
   ```

3. **Push to remote**:
   ```bash
   git push origin main
   # or your current branch
   git push origin [branch-name]
   ```

4. **Verify push succeeded**:
   - Check GitHub/GitLab for latest commit
   - Ensure CI/CD passes (if configured)

### Definition of "Significant Change"
Push to git after:
- ✅ New feature completed and tested
- ✅ Bug fix verified and working
- ✅ Refactoring that passes all checks
- ✅ Database schema changes (migrations)
- ✅ API route additions/modifications
- ✅ UI component completions
- ❌ NOT after: small typos, formatting, WIP code

### When Adding New Features
1. Add to appropriate `lib/` folder
2. Create/update types in `types/`
3. Add Zod validation if needed
4. Update API routes if needed
5. Update UI components
6. Update project status with new feature
7. Test end-to-end flow

### When Fixing Bugs
1. Identify root cause
2. Add test case to prevent regression
3. Fix the issue
4. Verify fix works
5. Update project status: move from 🔴 to ✅
6. Document fix in commit message

## Self-Check Questions
Before saying "done", ask:
- Does `npm run build` pass? ✅
- Did I test the change manually? ✅
- Is project status file updated? ✅
- Are types/interfaces updated? ✅
- Is validation schema updated if needed? ✅

## Notes
- SQLite for dev, PostgreSQL-compatible
- Status: ~90% complete
- Missing: Auth, Error boundaries, Settings page
- Lucide React for icons
- Local state management (no external state libraries)

## Code Style & Standards

### TypeScript Guidelines
- Use TypeScript for all new code files
- Define explicit types and interfaces for all data structures
- Avoid using `any` type - prefer `unknown` if type is truly unknown
- Use functional components with hooks exclusively
- Prefer `const` for all variables unless reassignment is needed
- Use optional chaining (`?.`) and nullish coalescing (`??`) operators

### React Best Practices
- Use functional components with hooks (no class components)
- Keep components small and focused on a single responsibility
- Extract reusable logic into custom hooks
- Use `React.FC` type for components that accept children
- Follow hooks rules: no conditional hooks, declare all hooks at component top
- Prefer controlled components over uncontrolled ones

### Naming Conventions
- **Components**: PascalCase (e.g., `RecipeCard`, `IngredientList`)
- **Files**: Match component name (e.g., `RecipeCard.tsx`)
- **Functions/Variables**: camelCase (e.g., `handleSubmit`, `recipeData`)
- **Interfaces/Types**: PascalCase with descriptive names (e.g., `Recipe`, `IngredientItem`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_INGREDIENTS`, `DEFAULT_SERVING_SIZE`)
- **Custom Hooks**: start with `use` prefix (e.g., `useRecipes`, `useLocalStorage`)

### File Organization
```
src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components (buttons, inputs)
│   └── recipe/         # Recipe-specific components
├── pages/              # Page-level components
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── constants/          # App-wide constants
```

## Recipe Domain Model

### Recipe Interface Structure
```typescript
interface Recipe {
  id: string;                    // Unique identifier (UUID or timestamp)
  title: string;                 // Recipe name
  description?: string;          // Short description
  ingredients: Ingredient[];     // List of ingredients
  instructions: string[];        // Step-by-step instructions
  prepTime?: number;             // In minutes
  cookTime?: number;             // In minutes
  servings?: number;             // Number of servings
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;             // e.g., "dessert", "main course"
  tags?: string[];               // Search/filter tags
  imageUrl?: string;             // Recipe image
  createdAt: Date;
  updatedAt: Date;
}

interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;                  // e.g., "cups", "grams", "tbsp"
}
```

## Component Guidelines

### Recipe Forms
- Always validate required fields before submission
- Provide clear error messages in Hebrew
- Support both metric and imperial units
- Allow dynamic addition/removal of ingredients and instruction steps
- Auto-save drafts to prevent data loss

### Recipe Display
- Show preparation and cooking time prominently
- Display difficulty level with visual indicators
- Make ingredient quantities adjustable based on servings
- Format instructions as numbered steps for clarity
- Support image upload/preview

### Lists & Grids
- Implement search and filter functionality
- Support sorting by: name, date created, difficulty, cooking time
- Use card-based layout for recipe previews
- Implement pagination or infinite scroll for large lists
- Show loading states and empty states

## Styling Guidelines

### Tailwind CSS Usage
- Use Tailwind utility classes for all styling
- Maintain consistent spacing using Tailwind's spacing scale
- Use semantic color names from Tailwind palette
- Implement responsive design: mobile-first approach
- Use Tailwind's dark mode utilities if dark mode is supported

### Color Scheme
- Primary: Use warm colors for food-related UI (orange, red tones)
- Success: Green for saved/completed states
- Warning: Yellow/amber for warnings
- Error: Red for validation errors
- Neutral: Gray scale for backgrounds and borders

### Accessibility
- All interactive elements must be keyboard accessible
- Use semantic HTML elements
- Provide alt text for all images
- Ensure sufficient color contrast (WCAG AA minimum)
- Use ARIA labels where necessary

## Data Management

### Local Storage
- Store recipes in browser localStorage
- Implement data persistence layer with try-catch blocks
- Version your data schema for future migrations
- Provide export/import functionality (JSON format)
- Clear strategy for handling storage quota exceeded

### State Management
- Use React's built-in hooks (useState, useReducer, useContext)
- Lift state only when necessary
- Consider Context API for theme/settings
- Avoid prop drilling - use composition or context

## Error Handling

### User-Facing Errors
- Display error messages in Hebrew
- Provide actionable error messages
- Show toast notifications for temporary errors
- Use error boundaries for component errors
- Log errors to console in development

### Validation
- Validate on blur and on submit
- Show inline validation errors
- Required fields: title, at least 1 ingredient, at least 1 instruction step
- Validate numeric inputs (prep time, servings, amounts)

## Hebrew Language Support

### Text Direction
- Set `dir="rtl"` on appropriate containers
- Use logical properties in CSS where possible
- Test layout with Hebrew text
- Support both Hebrew and English ingredient names

### Localization
- All UI labels and messages in Hebrew
- Format dates according to Hebrew locale
- Support Hebrew search and filtering
- Use appropriate Hebrew typography

## Performance Considerations

- Lazy load recipe images
- Debounce search input
- Memoize expensive calculations (e.g., filtered/sorted lists)
- Use React.memo for list items
- Implement virtual scrolling for large recipe lists

## Testing Preferences

- Write clear, descriptive test names in English
- Test user interactions, not implementation details
- Mock external dependencies
- Aim for meaningful test coverage, not 100%

## Comments & Documentation

- Write JSDoc comments for complex functions and hooks
- Document prop types with TypeScript interfaces
- Add inline comments only for non-obvious logic
- Keep comments up-to-date with code changes
- Use TODO comments with your name for future improvements

## Common Patterns to Use

### Custom Hooks
```typescript
// Example: useLocalStorage hook for recipe persistence
function useLocalStorage<T>(key: string, initialValue: T) {
  // Implementation with error handling
}
```

### Form Handling
```typescript
// Use controlled inputs with validation
// Separate form state from submission logic
```

### List Operations
```typescript
// Always generate unique IDs for new items
// Use array methods (map, filter) instead of loops
```

## Security Considerations

- Sanitize user input before rendering
- Validate file uploads (type, size)
- Use secure random IDs (crypto.randomUUID() if available)
- Don't store sensitive data in localStorage

## Git Commit Messages (Hebrew)

- Use imperative mood in Hebrew
- Examples:
  - "הוסף רכיב חדש להצגת מתכון"
  - "תקן באג בטופס עריכת מתכונים"
  - "שפר ביצועים של רשימת המתכונים"

## Additional Notes

- Prioritize user experience and intuitive design
- Design for cooks actively using the app in the kitchen
- Consider offline functionality for future enhancement
- Make the app print-friendly for recipe cards