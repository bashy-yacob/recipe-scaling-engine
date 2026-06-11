---
name: testing
description: בדיקות לפרויקט Recipe Scaling Engine. השתמש בסקיל זה כשכותבים בדיקות unit, integration, או component tests. כולל דוגמאות לבדיקת אלגוריתמים, API, וקומפוננטות React.
---

# Testing - Skill

סקיל זה מנחה כתיבת בדיקות לאפליקציית מתכונים.

## Tech Stack מומלץ
- **Test Runner**: Vitest
- **React Testing**: @testing-library/react
- **Mocking**: vitest mocks
- **API Testing**: supertest / MSW

## מבנה קבצי בדיקות

```
src/
├── lib/
│   ├── scaling/
│   │   ├── algorithms.ts
│   │   └── algorithms.test.ts      # בדיקות unit
│   └── validations/
│       ├── recipe.ts
│       └── recipe.test.ts          # בדיקות validation
├── components/
│   ├── RecipeCard.tsx
│   └── RecipeCard.test.tsx         # בדיקות component
└── __tests__/
    └── api/
        └── recipes.test.ts         # בדיקות API integration
```

## בדיקות אלגוריתמי Scaling

### Linear Scaling
```typescript
import { describe, it, expect } from 'vitest';
import { scaleIngredient, scaleIngredientRounded } from './algorithms';

describe('scaleIngredient - linear', () => {
  const linearRule = {
    type: 'linear' as const,
    baseAmount: 100,
    baseServings: 4,
  };

  it('should scale linearly when doubling servings', () => {
    const result = scaleIngredient(linearRule, 8);
    expect(result).toBe(200);
  });

  it('should scale linearly when halving servings', () => {
    const result = scaleIngredient(linearRule, 2);
    expect(result).toBe(50);
  });

  it('should return base amount for same servings', () => {
    const result = scaleIngredient(linearRule, 4);
    expect(result).toBe(100);
  });

  it('should handle fractional servings', () => {
    const result = scaleIngredient(linearRule, 6);
    expect(result).toBe(150);
  });
});
```

### Logarithmic Scaling (שמרים, שוקולד)
```typescript
describe('scaleIngredient - logarithmic', () => {
  const logRule = {
    type: 'logarithmic' as const,
    baseAmount: 7, // 7g שמרים
    baseServings: 4,
  };

  it('should scale slower than linear for double servings', () => {
    const result = scaleIngredient(logRule, 8);
    // לוגריתמי: 7 * (1 + log(2)/log(4)) = 7 * 1.5 = 10.5
    expect(result).toBeCloseTo(10.5, 1);
    // ליניארי היה נותן 14 - לוגריתמי נותן פחות!
    expect(result).toBeLessThan(14);
  });

  it('should approach base amount as ratio approaches 1', () => {
    const result = scaleIngredient(logRule, 4);
    expect(result).toBeCloseTo(7, 1);
  });

  it('should scale less than sqrt for large ratios', () => {
    const sqrtRule = { ...logRule, type: 'sqrt' as const };
    const logResult = scaleIngredient(logRule, 16);
    const sqrtResult = scaleIngredient(sqrtRule, 16);
    expect(logResult).toBeLessThan(sqrtResult);
  });
});
```

### Square Root Scaling (מלח, תבלינים)
```typescript
describe('scaleIngredient - sqrt', () => {
  const sqrtRule = {
    type: 'sqrt' as const,
    baseAmount: 1, // 1 כפית מלח
    baseServings: 4,
  };

  it('should scale by square root of ratio', () => {
    const result = scaleIngredient(sqrtRule, 16);
    // sqrt(4) = 2, so 1 * 2 = 2
    expect(result).toBe(2);
  });

  it('should scale between fixed and linear', () => {
    const linearRule = { ...sqrtRule, type: 'linear' as const };
    const fixedRule = { ...sqrtRule, type: 'fixed' as const };
    
    const sqrtResult = scaleIngredient(sqrtRule, 8);
    const linearResult = scaleIngredient(linearRule, 8);
    const fixedResult = scaleIngredient(fixedRule, 8);
    
    expect(sqrtResult).toBeGreaterThan(fixedResult);
    expect(sqrtResult).toBeLessThan(linearResult);
  });
});
```

### Fixed Scaling (וניל, צבע מאכל)
```typescript
describe('scaleIngredient - fixed', () => {
  const fixedRule = {
    type: 'fixed' as const,
    baseAmount: 1, // 1 כפית וניל
    baseServings: 4,
  };

  it('should not change for any serving count', () => {
    expect(scaleIngredient(fixedRule, 1)).toBe(1);
    expect(scaleIngredient(fixedRule, 8)).toBe(1);
    expect(scaleIngredient(fixedRule, 100)).toBe(1);
  });
});
```

### Round for Cooking
```typescript
describe('roundForCooking', () => {
  it('should round small amounts to nearest 1/8', () => {
    expect(roundForCooking(0.3)).toBe(0.25);
    expect(roundForCooking(0.6)).toBe(0.625);
    expect(roundForCooking(0.9)).toBe(0.875);
  });

  it('should round medium amounts to nearest 1/4', () => {
    expect(roundForCooking(1.1)).toBe(1);
    expect(roundForCooking(2.3)).toBe(2.25);
    expect(roundForCooking(5.6)).toBe(5.5);
  });

  it('should round larger amounts to nearest 5', () => {
    expect(roundForCooking(23)).toBe(25);
    expect(roundForCooking(47)).toBe(45);
  });

  it('should round very large amounts to nearest 10', () => {
    expect(roundForCooking(234)).toBe(230);
    expect(roundForCooking(567)).toBe(570);
  });
});
```

### Error Cases
```typescript
describe('scaleIngredient - errors', () => {
  const rule = { type: 'linear' as const, baseAmount: 100, baseServings: 4 };

  it('should throw for zero servings', () => {
    expect(() => scaleIngredient(rule, 0)).toThrow('Target servings must be positive');
  });

  it('should throw for negative servings', () => {
    expect(() => scaleIngredient(rule, -2)).toThrow('Target servings must be positive');
  });
});
```

## בדיקות Zod Validation

```typescript
import { describe, it, expect } from 'vitest';
import { recipeSchema, ingredientSchema } from './recipe';

describe('ingredientSchema', () => {
  it('should validate valid ingredient', () => {
    const result = ingredientSchema.safeParse({
      name: 'קמח',
      amount: 200,
      unit: 'גרם',
      scalingRule: 'linear',
    });
    expect(result.success).toBe(true);
  });

  it('should allow null amount for incomplete recipes', () => {
    const result = ingredientSchema.safeParse({
      name: 'סוכר',
      amount: null,
      unit: 'גרם',
    });
    expect(result.success).toBe(true);
  });

  it('should reject empty name', () => {
    const result = ingredientSchema.safeParse({
      name: '',
      amount: 100,
      unit: 'גרם',
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('שם המרכיב חובה');
  });

  it('should use linear as default scaling rule', () => {
    const result = ingredientSchema.parse({
      name: 'מים',
      amount: 100,
      unit: 'מ"ל',
    });
    expect(result.scalingRule).toBe('linear');
  });
});

describe('recipeSchema', () => {
  const validRecipe = {
    title: 'עוגת שוקולד',
    servings: 8,
    ingredients: [
      { name: 'קמח', amount: 200, unit: 'גרם' },
    ],
  };

  it('should validate complete recipe', () => {
    const result = recipeSchema.safeParse(validRecipe);
    expect(result.success).toBe(true);
  });

  it('should reject recipe without title', () => {
    const result = recipeSchema.safeParse({
      ...validRecipe,
      title: '',
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('שם המתכון חובה');
  });

  it('should reject recipe without ingredients', () => {
    const result = recipeSchema.safeParse({
      ...validRecipe,
      ingredients: [],
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('צריך לפחות מרכיב אחד');
  });

  it('should reject negative servings', () => {
    const result = recipeSchema.safeParse({
      ...validRecipe,
      servings: -1,
    });
    expect(result.success).toBe(false);
  });
});
```

## בדיקות React Components

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RecipeCard } from './RecipeCard';

describe('RecipeCard', () => {
  const mockRecipe = {
    id: '1',
    title: 'עוגת שוקולד',
    servings: 8,
    prepTime: 30,
    cookTime: 45,
    imageUrl: '/chocolate-cake.jpg',
  };

  it('should render recipe title', () => {
    render(<RecipeCard recipe={mockRecipe} />);
    expect(screen.getByText('עוגת שוקולד')).toBeInTheDocument();
  });

  it('should display serving count', () => {
    render(<RecipeCard recipe={mockRecipe} />);
    expect(screen.getByText('8 מנות')).toBeInTheDocument();
  });

  it('should show total time', () => {
    render(<RecipeCard recipe={mockRecipe} />);
    expect(screen.getByText('75 דקות')).toBeInTheDocument(); // 30 + 45
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<RecipeCard recipe={mockRecipe} onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('article'));
    expect(handleClick).toHaveBeenCalledWith(mockRecipe.id);
  });

  it('should show placeholder when no image', () => {
    render(<RecipeCard recipe={{ ...mockRecipe, imageUrl: undefined }} />);
    expect(screen.getByTestId('placeholder-image')).toBeInTheDocument();
  });
});
```

## בדיקות טפסים

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecipeForm } from './RecipeForm';

describe('RecipeForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('should show validation error for empty title', async () => {
    render(<RecipeForm onSubmit={mockOnSubmit} />);
    
    await userEvent.click(screen.getByRole('button', { name: /שמור/i }));
    
    await waitFor(() => {
      expect(screen.getByText('שם המתכון חובה')).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should submit valid form', async () => {
    render(<RecipeForm onSubmit={mockOnSubmit} />);
    
    await userEvent.type(screen.getByLabelText('שם המתכון'), 'עוגת גבינה');
    await userEvent.type(screen.getByLabelText('מספר מנות'), '8');
    
    // הוסף מרכיב
    await userEvent.click(screen.getByRole('button', { name: /הוסף מרכיב/i }));
    await userEvent.type(screen.getByPlaceholderText('שם המרכיב'), 'גבינה');
    await userEvent.type(screen.getByPlaceholderText('כמות'), '500');
    
    await userEvent.click(screen.getByRole('button', { name: /שמור/i }));
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'עוגת גבינה',
          servings: 8,
        })
      );
    });
  });
});
```

## Mock Prisma

```typescript
import { vi } from 'vitest';
import { PrismaClient } from '@prisma/client';

// Mock Prisma client
vi.mock('@/lib/prisma', () => ({
  prisma: {
    recipe: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    ingredient: {
      findMany: vi.fn(),
    },
  },
}));

// שימוש בבדיקה
import { prisma } from '@/lib/prisma';

describe('getRecipe', () => {
  it('should return recipe with ingredients', async () => {
    const mockRecipe = {
      id: '1',
      title: 'עוגה',
      recipeIngredients: [
        { ingredient: { name: 'קמח' }, amount: 200, unit: 'גרם' },
      ],
    };
    
    vi.mocked(prisma.recipe.findUnique).mockResolvedValue(mockRecipe);
    
    const result = await getRecipe('1');
    
    expect(result).toEqual(mockRecipe);
    expect(prisma.recipe.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
      include: expect.any(Object),
    });
  });
});
```

## Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
});
```

## Best Practices

1. **תאר בדיקות באנגלית** - שמות describe/it באנגלית לקריאות
2. **נתונים בעברית** - נתוני בדיקה בעברית כמו באפליקציה
3. **בדוק edge cases** - 0, null, negative, empty arrays
4. **בדוק הודעות שגיאה** - וודא שההודעות בעברית
5. **Mock רק מה שצריך** - אל תעשה over-mock
6. **AAA Pattern** - Arrange, Act, Assert

## פקודות הרצה

```bash
# הרץ כל הבדיקות
npm test

# הרץ בדיקות ב-watch mode
npm test -- --watch

# הרץ בדיקות עם coverage
npm test -- --coverage

# הרץ קובץ ספציפי
npm test -- algorithms.test.ts
```
