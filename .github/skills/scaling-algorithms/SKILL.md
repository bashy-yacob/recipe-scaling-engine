---
name: scaling-algorithms
description: אלגוריתמי שינוי קנה מידה למתכונים. השתמש בסקיל זה כשעובדים עם חישובי כמויות, המרות יחידות, או לוגיקת ה-scaling של המערכת. כולל 4 סוגי אלגוריתמים ופונקציות עיגול לבישול.
---

# Recipe Scaling Algorithms - Skill

סקיל זה מנחה יצירה ותחזוקה של אלגוריתמי שינוי קנה מידה למתכונים.

## קבצים רלוונטיים
- `src/lib/scaling/algorithms.ts` - אלגוריתמי scaling
- `src/lib/scaling/conversions.ts` - המרות יחידות
- `src/lib/scaling/index.ts` - exports

## 4 סוגי Scaling Rules

### 1. Linear (ליניארי) - ברירת מחדל
```typescript
// רוב המרכיבים: קמח, סוכר, מים, חמאה
// נוסחה: baseAmount × ratio
amount = baseAmount * (targetServings / baseServings);

// דוגמה: 200g קמח ל-4 מנות → 400g ל-8 מנות
```

### 2. Logarithmic (לוגריתמי) - מרכיבים אקטיביים
```typescript
// עבור: שמרים, שוקולד, קפה, אבקת אפייה גדולה
// נוסחה: baseAmount × (1 + log(ratio) / log(4))
amount = baseAmount * (1 + Math.log(ratio) / Math.log(4));

// הסיבה: מרכיבים אלה לא צריכים לגדול באותו יחס
// יותר מדי שמרים = טעם רע, יותר מדי שוקולד = מר מדי
// דוגמה: 7g שמרים ל-4 מנות → ~10.5g ל-8 מנות (לא 14g!)
```

### 3. Square Root (שורש) - תבלינים ומלח
```typescript
// עבור: מלח, פלפל, תבלינים חזקים, ג'ינג'ר
// נוסחה: baseAmount × √ratio
amount = baseAmount * Math.sqrt(ratio);

// הסיבה: טעם לא גדל ליניארית עם הכמות
// דוגמה: 1 כפית מלח ל-4 מנות → ~1.4 כפית ל-8 מנות (לא 2!)
```

### 4. Fixed (קבוע) - לא משתנה
```typescript
// עבור: תמצית וניל, צבע מאכל, שמן לסיכה
// הכמות נשארת זהה
amount = baseAmount;

// הסיבה: כמויות קטנות שמספיקות לכל גודל מתכון
// דוגמה: 1 כפית וניל ל-4 מנות → 1 כפית גם ל-8 מנות
```

## עיגול לבישול (roundForCooking)

```typescript
export function roundForCooking(amount: number): number {
  // פחות מ-1: עיגול ל-1/8 הקרוב
  if (amount < 1) {
    return Math.round(amount * 8) / 8;  // 0.125 increments
  }
  
  // 1-10: עיגול ל-1/4 הקרוב
  if (amount <= 10) {
    return Math.round(amount * 4) / 4;  // 0.25 increments
  }
  
  // 10-100: עיגול ל-5 הקרוב
  if (amount <= 100) {
    return Math.round(amount / 5) * 5;  // 5, 10, 15...
  }
  
  // 100+: עיגול ל-10 הקרוב
  return Math.round(amount / 10) * 10;  // 100, 110, 120...
}
```

## Interface מרכזי

```typescript
interface ScalingRule {
  type: 'linear' | 'logarithmic' | 'sqrt' | 'fixed';
  baseAmount: number;
  baseServings: number;
}

interface ScaledResult {
  amount: number;      // כמות מדויקת
  rounded: number;     // כמות מעוגלת לבישול
}
```

## פונקציות לייצוא

```typescript
// שימוש בסיסי
export function scaleIngredient(rule: ScalingRule, targetServings: number): number;

// עם עיגול לבישול
export function scaleIngredientRounded(rule: ScalingRule, targetServings: number): number;

// פונקציית עיגול עצמאית
export function roundForCooking(amount: number): number;
```

## דוגמת שימוש מלאה

```typescript
import { scaleIngredient, scaleIngredientRounded, roundForCooking } from '@/lib/scaling';

// מתכון בסיסי ל-4 מנות
const baseServings = 4;
const targetServings = 10;

const ingredients = [
  { name: 'קמח', amount: 200, rule: 'linear' as const },
  { name: 'שמרים', amount: 7, rule: 'logarithmic' as const },
  { name: 'מלח', amount: 1, rule: 'sqrt' as const },
  { name: 'וניל', amount: 1, rule: 'fixed' as const },
];

const scaled = ingredients.map(ing => ({
  name: ing.name,
  original: ing.amount,
  scaled: scaleIngredientRounded(
    { type: ing.rule, baseAmount: ing.amount, baseServings },
    targetServings
  ),
}));

// תוצאה:
// קמח: 200 → 500 (×2.5 ליניארי)
// שמרים: 7 → 11.5 (לוגריתמי - גדל לאט יותר)
// מלח: 1 → 1.5 (שורש - גדל לאט)
// וניל: 1 → 1 (קבוע)
```

## המרות יחידות

```typescript
import { convertUnits, gramsToCups, mlToCups } from '@/lib/scaling/conversions';

// המרה בסיסית
convertUnits(100, 'g', 'oz');     // → 3.527
convertUnits(1, 'cup', 'ml');     // → 240
convertUnits(2, 'כף', 'ml');      // → 30

// המרה לכוסות (משתנה לפי מרכיב)
gramsToCups(240, 'flour');        // → 2 (קמח קל יותר)
gramsToCups(240, 'sugar');        // → 1.07 (סוכר כבד יותר)
```

## יחידות נתמכות

### מטרי:
- `g`, `gram`, `גרם`
- `kg`, `kilogram`, `קילו`
- `ml`, `milliliter`, `מ"ל`
- `l`, `liter`, `ליטר`

### אימפריאלי:
- `tsp`, `teaspoon`, `כפית`
- `tbsp`, `tablespoon`, `כף`
- `cup`, `cups`, `כוס`
- `oz`, `ounce`
- `lb`, `pound`
- `fl_oz`, `pint`, `quart`, `gallon`

## כללי חישוב חשובים

1. **תמיד בדוק `targetServings > 0`** - זרוק שגיאה אם לא
2. **השתמש ב-`roundForCooking` להצגה למשתמש** - אף אחד לא מודד 7.3g מלח
3. **שמור את הכמות המדויקת לחישובים הבאים** - עיגול רק בסוף
4. **ברירת מחדל ל-`linear`** - אם לא צוין אחרת

## טיפים לבחירת Rule נכון

| מרכיב | Rule | סיבה |
|-------|------|------|
| קמח, סוכר, חמאה | linear | כמות פרופורציונלית |
| שמרים, אבקת אפייה | logarithmic | פעילים - יותר מדי זה רע |
| מלח, פלפל, תבלינים | sqrt | טעם לא ליניארי |
| וניל, צבע מאכל | fixed | כמות קטנה מספיקה |
| ביצים | linear + עיגול | עיגול למספר שלם |
| שוקולד (בכמויות גדולות) | logarithmic | מרירות מצטברת |
