---
applyTo: "**/*.{tsx,ts,css}"
---
# Design & UI Instructions

## Tech Stack & Design System
- **Framework**: React 19 (Next.js 16 App Router)
- **UI Library**: Chakra UI v3
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Fonts**: 'Assistant' (Google Fonts) for Hebrew
- **Styling Method**: Chakra UI props & system (avoid inline CSS)

## Core Design Principles
1.  **Mobile First**: Ensure all layouts work on mobile devices.
2.  **RTL (Right-to-Left)**: Native support for Hebrew.
    - Use logical properties (`marginStart`, `marginEnd`) instead of `marginLeft`/`marginRight`.
    - Ensure flex containers have correct direction logic.
3.  **Accessibility (a11y)**:
    - Use semantic HTML.
    - Ensure sufficient color contrast.
    - All interactive elements must be focusable.
4.  **Warm & Appetizing**: Use warm color tones typical for food apps.

## Color Palette
Use Chakra UI's semantic tokens or theme scaling.
- **Primary**: Warm Orange/Terra Cotta (e.g., `orange.500`, `orange.600`) - for main actions.
- **Secondary**: Sage Green or Soft Teal - for success/freshness indicators.
- **Background**: `gray.50` for general page background to reduce eye strain compared to pure white.
- **Text**: `gray.800` for primary text, `gray.600` for secondary.
- **Error**: `red.500`
- **Warning**: `yellow.500`

## Component Guidelines

### Layouts
- Use `<Container>` to center content with `maxW` constraints.
- Use `<Stack>` (`VStack`, `HStack`) for spacing items evenly instead of manual margins.
- Use `<Grid>` or `<SimpleGrid>` for responsive recipe cards.

### Typography
- **Heading**: Use for page titles. `fontFamily="Assistant"`.
- **Text**: Use for body content.
- **Hebrew Support**: Ensure `dir="rtl"` is set on the root layout or body.

### Buttons
- **Primary Action**: Solid variant, Primary color.
- **Secondary Action**: Outline or Ghost variant.
- **Destructive**: Red color scheme.

### Cards (Recipes)
- Use standard Card components (`Card`, `CardBody`, etc.).
- consistent spacing (`p={4}` or `p={6}`).
- Rounded corners (`rounded="md"` or `rounded="lg"`).
- Subtle shadow (`shadow="sm"`), hover effect (`_hover={{ shadow: 'md' }}`).

### Forms
- Use `FormControl`, `FormLabel`, `FormErrorMessage`, `FormHelperText`.
- Validate inputs visually (red borders/text for errors).

## CSS / Styling Rules
- **Properties**: Prefer Chakra shorthand props (`m`, `p`, `bg`, `c`) for brevity.
- **Avoid**: Raw CSS files (except `globals.css` for fonts/reset).
- **Responsive**: Use array syntax or object syntax for breakpoints.
  ```tsx
  <Box w={{ base: "100%", md: "50%" }}>...</Box>
  ```

## Icons
- Import from `lucide-react`.
- Pass Lucide icons to Chakra's `<Icon />` or use them directly if wrapped properly.
  ```tsx
  <Icon as={ChefHat} boxSize={6} />
  ```

## Hebrew Specifics
- Text Alignment: Default is right for Hebrew.
- Input fields should have `dir="rtl"`.
- Placeholders in Hebrew.
- Date/Currency formatting: Use Hebrew locale (`he-IL`).

## Example pattern
```tsx
import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { Plus } from "lucide-react";

export const PageHeader = ({ title, action }: { title: string, action?: () => void }) => {
  return (
    <Box as="header" py={6} borderBottomWidth={1} borderColor="gray.100">
      <VStack align="stretch" spacing={4}>
        <Heading as="h1" size="xl" color="gray.800">
          {title}
        </Heading>
        {action && (
          <Button leftIcon={<Plus />} onClick={action} colorScheme="orange">
            צור מתכון חדש
          </Button>
        )}
      </VStack>
    </Box>
  );
};
```
