---
applyTo: "**/*.{tsx,ts,css}"
---
# Design & UI Instructions

> 📚 לפרטים מלאים על עיצוב UI ראה: `.github/skills/first/SKILL.md`

## Tech Stack
- **Framework**: React 19 + Vite + TypeScript (strict)
- **UI Library**: Chakra UI v3
- **Icons**: Lucide React בלבד
- **Animations**: Framer Motion
- **Font**: 'Assistant' (Google Fonts) - מותאם לעברית

## עקרונות עיצוב

### 1. Mobile First
- כל layout עובד במובייל קודם
- Responsive עם Chakra: `{{ base: "100%", md: "50%" }}`

### 2. RTL (עברית)
- `dir="rtl"` על containers ראשיים
- Logical properties: `marginStart`/`marginEnd` (לא left/right)
- פונט Assistant לכל הטקסט

### 3. Accessibility
- Semantic HTML (`<main>`, `<article>`, `<nav>`)
- Color contrast מספיק (WCAG AA)
- כל אלמנט אינטראקטיבי focusable

### 4. עיצוב חם ומזמין
- זו אפליקציית אוכל - העיצוב צריך לעורר תיאבון

## פלטת צבעים

| שימוש | צבע | דוגמה |
|-------|-----|-------|
| Primary | Orange | `colorScheme="orange"` |
| Success | Green | `colorScheme="green"` |
| Background | Gray.50 | `bg="gray.50"` |
| Text Primary | Gray.800 | `color="gray.800"` |
| Text Secondary | Gray.600 | `color="gray.600"` |
| Error | Red | `colorScheme="red"` |

## קומפוננטות Chakra

### כפתורים
```tsx
<Button colorScheme="orange">פעולה ראשית</Button>
<Button variant="outline" colorScheme="orange">פעולה משנית</Button>
<Button colorScheme="red" variant="ghost">מחק</Button>
```

### כרטיסים
```tsx
<Card rounded="lg" shadow="sm" _hover={{ shadow: 'md' }}>
  <CardBody p={4}>...</CardBody>
</Card>
```

### טפסים
```tsx
<FormControl isInvalid={!!error}>
  <FormLabel>שם המתכון</FormLabel>
  <Input dir="rtl" focusBorderColor="orange.500" />
  <FormErrorMessage>שדה חובה</FormErrorMessage>
</FormControl>
```

### רשת מתכונים
```tsx
<SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
  {recipes.map(r => <RecipeCard key={r.id} {...r} />)}
</SimpleGrid>
```

## אייקונים (Lucide React)
```tsx
import { ChefHat, Plus, Trash } from "lucide-react";

<Button leftIcon={<Plus size={18} />}>הוסף</Button>
```

## Toasts
```tsx
import { toast } from '@/components/ui/toaster';
toast.success({ description: 'נשמר בהצלחה' });
toast.error({ description: 'שגיאה בשמירה' });
```

## מה להימנע

❌ CSS קבצים נפרדים (חוץ מ-globals.css)
❌ Inline styles (`style={{}}`)
❌ פונטים אחרים מלבד Assistant
❌ `marginLeft`/`marginRight` - השתמש ב-logical properties
❌ אייקונים שלא מ-Lucide
