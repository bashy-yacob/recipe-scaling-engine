'use client';

import { useState, KeyboardEvent, useRef } from 'react';
import {
  Box, Container, Heading, Text, Button, Input, Textarea, Card,
  HStack, Stack, Badge, Field, Grid, IconButton, SimpleGrid,
} from '@chakra-ui/react';
import Link from 'next/link';
import { ArrowRight, Save, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

interface Instruction {
  id: string;
  description: string;
}

export default function NewRecipePage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', name: '', amount: '', unit: 'גרם' },
  ]);
  const [instructions, setInstructions] = useState<Instruction[]>([
    { id: '1', description: '' },
  ]);

  const ingredientsRef = useRef<HTMLDivElement>(null);
  const instructionsRef = useRef<HTMLDivElement>(null);

  const addIngredient = () => {
    setIngredients(prev => [...prev, { id: Date.now().toString(), name: '', amount: '', unit: '' }]);
  };

  const addInstruction = () => {
    setInstructions(prev => [...prev, { id: (Date.now() + 1).toString(), description: '' }]);
  };

  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const removeInstruction = (id: string) => {
    if (instructions.length > 1) setInstructions(instructions.filter(inst => inst.id !== id));
  };

  // לוגיקת אנטר למרכיבים: עובר תא תא, ורק בסוף שורה מוסיף חדשה
  const handleIngredientKeyDown = (e: KeyboardEvent<HTMLInputElement>, rowIndex: number, fieldIndex: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const rowInputs = ingredientsRef.current?.querySelectorAll(`[data-row="${rowIndex}"] input`);
      
      if (fieldIndex < 2) {
        // אם לא בתא האחרון של השורה (שם=0, כמות=1, יחידה=2) -> עבור לתא הבא
        (rowInputs?.[fieldIndex + 1] as HTMLElement)?.focus();
      } else {
        // אנחנו בתא "יחידה" (האחרון בשורה)
        if (rowIndex === ingredients.length - 1) {
          // אם זו השורה האחרונה - הוסף שורה חדשה
          addIngredient();
          setTimeout(() => {
            const nextRowInputs = ingredientsRef.current?.querySelectorAll(`[data-row="${rowIndex + 1}"] input`);
            (nextRowInputs?.[0] as HTMLElement)?.focus();
          }, 10);
        } else {
          // אם זו לא השורה האחרונה - פשוט רד לשורה הבאה לתא הראשון
          const nextRowInputs = ingredientsRef.current?.querySelectorAll(`[data-row="${rowIndex + 1}"] input`);
          (nextRowInputs?.[0] as HTMLElement)?.focus();
        }
      }
    }
  };

  const handleInstructionKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>, index: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (index === instructions.length - 1) {
        addInstruction();
        setTimeout(() => {
          const texts = instructionsRef.current?.querySelectorAll('textarea');
          texts?.[texts.length - 1]?.focus();
        }, 10);
      } else {
        const texts = instructionsRef.current?.querySelectorAll('textarea');
        texts?.[index + 1]?.focus();
      }
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" dir="rtl" w="100%">
      {/* Header */}
      <Box bg="white" borderBottom="1px" borderColor="gray.200" py={4} position="sticky" top={0} zIndex={10}>
        <Container maxW="4xl" mx="auto" px={4}>
          <HStack justify="space-between">
            <HStack gap={4}>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/recipes">
                  <ArrowRight size={20} style={{ marginLeft: '8px' }} /> חזרה
                </Link>
              </Button>
              <Heading size="md" fontWeight="bold">מתכון חדש</Heading>
            </HStack>
            <Button bg="orange.500" color="white" _hover={{ bg: 'orange.600' }} size="sm" px={6}>
              <Save size={18} style={{ marginLeft: '6px' }} /> שמור מתכון
            </Button>
          </HStack>
        </Container>
      </Box>

      <Container maxW="4xl" mx="auto" py={10} px={4}>
        <Stack gap={8}>
          
          {/* פרטים בסיסיים */}
          <Card.Root variant="raised" boxShadow="sm" borderRadius="xl">
            <Card.Header px={8} pt={8}><Heading size="md">פרטים בסיסיים</Heading></Card.Header>
            <Card.Body px={8} pb={8}>
              <Stack gap={6}>
                <Field.Root required>
                  <Field.Label fontWeight="bold">שם המתכון</Field.Label>
                  <Input placeholder="לדוגמה: עוגת שוקולד חמה" size="lg" />
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="bold">תיאור קצר</Field.Label>
                  <Textarea placeholder="ספרי בכמה מילים על המתכון..." rows={2} />
                </Field.Root>

                <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
                  <Field.Root required><Field.Label fontWeight="bold">מנות</Field.Label><Input type="number" defaultValue="4" /></Field.Root>
                  <Field.Root><Field.Label fontWeight="bold">זמן הכנה (דק')</Field.Label><Input placeholder="30" /></Field.Root>
                  <Field.Root><Field.Label fontWeight="bold">זמן אפייה (דק')</Field.Label><Input placeholder="45" /></Field.Root>
                </SimpleGrid>

                {/* תמונה (החלק שהיה חסר) */}
                <Field.Root>
                  <Field.Label fontWeight="bold">תמונת המתכון</Field.Label>
                  <Box
                    border="2px dashed" borderColor="gray.200" borderRadius="lg" p={10}
                    textAlign="center" bg="gray.50" cursor="pointer"
                    _hover={{ bg: 'orange.50', borderColor: 'orange.200' }}
                  >
                    <Stack gap={2} align="center">
                      <ImageIcon size={40} color="gray" />
                      <Text fontWeight="medium">לחצי להעלאת תמונה</Text>
                      <Text fontSize="xs" color="gray.500">JPG, PNG עד 5MB</Text>
                    </Stack>
                  </Box>
                </Field.Root>
              </Stack>
            </Card.Body>
          </Card.Root>

          {/* מרכיבים */}
          <Card.Root variant="raised" boxShadow="sm" borderRadius="xl">
            <Card.Header px={8} pt={8} borderBottomWidth="1px" pb={4} mb={4}>
              <HStack justify="space-between">
                <Heading size="md">מרכיבים</Heading>
                <Button size="sm" variant="outline" colorPalette="orange" onClick={addIngredient}>
                  <Plus size={16} /> הוסף מרכיב
                </Button>
              </HStack>
            </Card.Header>
            <Card.Body px={8} pb={8} ref={ingredientsRef}>
              <Stack gap={3}>
                {ingredients.map((ing, idx) => (
                  <Grid key={ing.id} data-row={idx} templateColumns="40px 2fr 1fr 1fr 40px" gap={3} alignItems="center">
                    <Text fontWeight="bold" color="orange.500" textAlign="center">{idx + 1}</Text>
                    <Input placeholder="מרכיב" onKeyDown={(e) => handleIngredientKeyDown(e, idx, 0)} />
                    <Input placeholder="כמות" type="text" onKeyDown={(e) => handleIngredientKeyDown(e, idx, 1)} />
                    <Input placeholder="יחידה" onKeyDown={(e) => handleIngredientKeyDown(e, idx, 2)} />
                    <IconButton variant="ghost" colorPalette="red" onClick={() => removeIngredient(ing.id)} disabled={ingredients.length === 1}>
                      <Trash2 size={18} />
                    </IconButton>
                  </Grid>
                ))}
              </Stack>
            </Card.Body>
          </Card.Root>

          {/* שלבי הכנה */}
          <Card.Root variant="raised" boxShadow="sm" borderRadius="xl">
            <Card.Header px={8} pt={8} borderBottomWidth="1px" pb={4} mb={4}>
              <HStack justify="space-between">
                <Heading size="md">שלבי הכנה</Heading>
                <Button size="sm" variant="outline" colorPalette="orange" onClick={addInstruction}>
                  <Plus size={16} /> הוסף שלב
                </Button>
              </HStack>
            </Card.Header>
            <Card.Body px={8} pb={8} ref={instructionsRef}>
              <Stack gap={5}>
                {instructions.map((inst, idx) => (
                  <HStack key={inst.id} gap={4} align="start">
                    <Badge bg="orange.500" color="white" borderRadius="full" minW="28px" h="28px" display="flex" alignItems="center" justifyContent="center">
                      {idx + 1}
                    </Badge>
                    <Textarea
                      flex={1}
                      placeholder="מה עושים בשלב הזה?"
                      rows={2}
                      onKeyDown={(e) => handleInstructionKeyDown(e, idx)}
                    />
                    <IconButton variant="ghost" colorPalette="red" onClick={() => removeInstruction(inst.id)} disabled={instructions.length === 1}>
                      <Trash2 size={18} />
                    </IconButton>
                  </HStack>
                ))}
              </Stack>
            </Card.Body>
          </Card.Root>

          {/* תגיות (החלק שהיה חסר) */}
          <Card.Root variant="raised" boxShadow="sm" borderRadius="xl">
            <Card.Header px={8} pt={8}><Heading size="md">תגיות</Heading></Card.Header>
            <Card.Body px={8} pb={8}>
              <Stack gap={4}>
                <Field.Root>
                  <Input placeholder="אפייה, קל, ללא גלוטן..." />
                  <Field.HelperText>הפרידי תגיות בפסיקים</Field.HelperText>
                </Field.Root>
                <HStack gap={2}>
                  <Badge colorPalette="orange" variant="subtle" px={3} py={1} borderRadius="full">אפייה</Badge>
                  <Badge colorPalette="green" variant="subtle" px={3} py={1} borderRadius="full">בריא</Badge>
                </HStack>
              </Stack>
            </Card.Body>
          </Card.Root>

          {/* כפתור שמירה סופי */}
          <Box textAlign="center" py={10}>
            <Button size="xl" bg="orange.500" color="white" _hover={{ bg: 'orange.600' }} px={20} boxShadow="lg">
              <Save size={22} style={{ marginLeft: '10px' }} /> שמור מתכון ופרסם
            </Button>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}