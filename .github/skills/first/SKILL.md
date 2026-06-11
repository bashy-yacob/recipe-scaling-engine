---
name: first
description: עיצוב ממשק משתמש לאפליקציית מתכונים עם Chakra UI v3. השתמש בסקיל הזה כשמבקשים לבנות קומפוננטות, דפים או לשפר עיצוב באפליקציית Recipe Scaling Engine. מייצר קוד React/TypeScript מוכן לייצור עם עיצוב חם ומזמין לאוכל.
---

# Recipe Scaling Engine - UI Design Skill

סקיל זה מנחה יצירת ממשקי משתמש מקצועיים לאפליקציית מתכונים בעברית.

## Tech Stack (חובה)
- **Framework**: React 19 + TypeScript (strict mode)
- **UI Library**: Chakra UI v3 - השתמש בקומפוננטות וב-props של צ'אקרה בלבד
- **Icons**: Lucide React בלבד
- **Animations**: Framer Motion למעברים ואנימציות
- **Font**: 'Assistant' (Google Fonts) - מותאם לעברית

## עקרונות עיצוב

### כיוון הטקסט (RTL)
- כל הטקסט בעברית, dir="rtl"
- השתמש ב-logical properties: `marginStart`, `marginEnd`, `paddingStart`, `paddingEnd`
- הימנע מ-`left`/`right` - השתמש ב-`start`/`end`

### פלטת צבעים (חמה ומזמינה)
```tsx
// Primary - כתום חם לפעולות עיקריות
colorScheme="orange"  // orange.500, orange.600

// Secondary - ירוק מרווה לטריות
colorScheme="green"   // green.500, green.600

// Background
bg="gray.50"          // רקע כללי
bg="white"            // כרטיסים ומודלים

// Text
color="gray.800"      // טקסט ראשי
color="gray.600"      // טקסט משני
color="gray.500"      // placeholder

// Status
colorScheme="red"     // שגיאות
colorScheme="yellow"  // אזהרות
```

### טיפוגרפיה
```tsx
// כותרות
<Heading fontFamily="Assistant" fontWeight="700">כותרת ראשית</Heading>

// טקסט גוף
<Text fontFamily="Assistant" fontWeight="400">תוכן</Text>

// גדלים
size="xl"   // כותרות דפים
size="lg"   // כותרות משניות
size="md"   // טקסט רגיל
size="sm"   // הערות וכיתובים
```

## קומפוננטות נפוצות

### כרטיסי מתכון
```tsx
<Card 
  rounded="lg" 
  shadow="sm" 
  _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
  transition="all 0.2s"
>
  <CardBody p={4}>
    {/* תוכן */}
  </CardBody>
</Card>
```

### כפתורים
```tsx
// פעולה ראשית
<Button colorScheme="orange" size="md">שמור מתכון</Button>

// פעולה משנית
<Button variant="outline" colorScheme="orange">ביטול</Button>

// פעולה מסוכנת
<Button colorScheme="red" variant="ghost">מחק</Button>

// עם אייקון
<Button leftIcon={<Plus />} colorScheme="orange">הוסף מרכיב</Button>
```

### טפסים
```tsx
<FormControl isInvalid={!!errors.title}>
  <FormLabel>שם המתכון</FormLabel>
  <Input 
    dir="rtl" 
    placeholder="הכנס שם מתכון..."
    focusBorderColor="orange.500"
  />
  <FormErrorMessage>שדה חובה</FormErrorMessage>
</FormControl>
```

### רשת מתכונים
```tsx
<SimpleGrid 
  columns={{ base: 1, sm: 2, md: 3, lg: 4 }} 
  spacing={6}
>
  {recipes.map(recipe => <RecipeCard key={recipe.id} {...recipe} />)}
</SimpleGrid>
```

## אנימציות (Framer Motion)

### כניסה לדף
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* תוכן */}
</motion.div>
```

### רשימה עם stagger
```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.div variants={container} initial="hidden" animate="show">
  {items.map(i => <motion.div key={i} variants={item}>{i}</motion.div>)}
</motion.div>
```

### Hover effects
```tsx
<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
  <Card>...</Card>
</motion.div>
```

## תבנית קומפוננטה מלאה

```tsx
import { Box, Button, Heading, VStack, Container } from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  title: string;
  onAction?: () => void;
}

export const RecipePageHeader: React.FC<Props> = ({ title, onAction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Box 
        as="header" 
        py={6} 
        borderBottomWidth={1} 
        borderColor="gray.100"
        bg="white"
      >
        <Container maxW="container.xl">
          <VStack align="stretch" spacing={4} dir="rtl">
            <Heading 
              as="h1" 
              size="xl" 
              color="gray.800"
              fontFamily="Assistant"
            >
              {title}
            </Heading>
            {onAction && (
              <Button 
                leftIcon={<Plus size={18} />} 
                onClick={onAction} 
                colorScheme="orange"
                size="md"
              >
                צור מתכון חדש
              </Button>
            )}
          </VStack>
        </Container>
      </Box>
    </motion.div>
  );
};
```

## מה להימנע

❌ **אסור**:
- CSS קבצים נפרדים (חוץ מ-globals.css)
- Inline styles (`style={{}}`)
- פונטים אחרים מלבד Assistant
- צבעים שלא מפלטת הצבעים
- `marginLeft`/`marginRight` - השתמש ב-`marginStart`/`marginEnd`
- אייקונים שלא מ-Lucide React
- קומפוננטות UI שלא מ-Chakra

✅ **חובה**:
- TypeScript עם types מפורשים
- Chakra props בלבד לסטיילים
- תמיכה ב-mobile-first (responsive)
- dir="rtl" על containers ראשיים
- Hebrew error messages ("שדה חובה", "מספר לא תקין")
- Accessible components (focusable, keyboard nav)

## הודעות Toast

```tsx
import { toast } from '@/components/ui/toaster';

// הצלחה
toast.success({ description: 'המתכון נשמר בהצלחה' });

// שגיאה
toast.error({ description: 'שגיאה בשמירת המתכון' });

// מידע
toast.info({ description: 'המתכון הועתק ללוח' });
```

## מצבי טעינה וריקנות

```tsx
// טעינה
if (isLoading) {
  return (
    <Center h="200px">
      <Spinner color="orange.500" size="lg" />
    </Center>
  );
}

// רשימה ריקה
if (recipes.length === 0) {
  return (
    <Center h="200px" flexDirection="column" gap={4}>
      <Text color="gray.500">אין מתכונים עדיין</Text>
      <Button colorScheme="orange" onClick={onCreate}>
        צור מתכון ראשון
      </Button>
    </Center>
  );
}
```

## זכור
1. **חום ומזמין** - זו אפליקציית אוכל, העיצוב צריך לעורר תיאבון
2. **פשטות** - המשתמש מבשל, הממשק צריך להיות נקי וברור
3. **עברית נכונה** - יישור ימין, RTL, הודעות משמעותיות
4. **מובייל קודם** - הרבה ישתמשו בטלפון תוך כדי בישול