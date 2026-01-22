'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box, Container, Heading, Text, Button, HStack, Stack, Badge, SimpleGrid,
  Card, Center, Spinner, Tabs, useToast,
} from '@chakra-ui/react';
import Link from 'next/link';
import { ArrowRight, Edit2, Trash2, Share2, Heart, Clock, Users } from 'lucide-react';

interface Recipe {
  id: string;
  title: string;
  description?: string;
  servings: number;
  prepTime?: number;
  cookTime?: number;
  totalTime?: number;
  recipeIngredients: Array<{ ingredient: { name: string }; amount: number; unit: string }>;
  instructions: Array<{ content: string; order: number }>;
}

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [servingMultiplier, setServingMultiplier] = useState(1);

  const recipeId = params.id as string;

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`/api/recipes/${recipeId}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error('Error fetching recipe:', error);
        toast.create({ title: 'שגיאה בטעינה', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId, toast]);

  const handleDelete = async () => {
    if (!confirm('בטוח שברצונך למחוק את המתכון?')) return;

    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');

      toast.create({ title: 'המתכון נמחק בהצלחה', type: 'success' });
      router.push('/dashboard/recipes');
    } catch (error) {
      console.error('Error:', error);
      toast.create({ title: 'שגיאה בעדכון', type: 'error' });
    }
  };

  if (loading) {
    return (
      <Center w="full" h="100vh">
        <Spinner size="xl" color="orange.500" />
      </Center>
    );
  }

  if (!recipe) {
    return (
      <Center w="full" h="100vh" flexDirection="column" gap={4}>
        <Heading>המתכון לא נמצא</Heading>
        <Button asChild>
          <Link href="/dashboard/recipes">חזרה למתכונים</Link>
        </Button>
      </Center>
    );
  }

  const scaledServings = recipe.servings * servingMultiplier;

  return (
    <Box minH="100vh" bg="gray.50" dir="rtl">
      {/* Header */}
      <Box bg="white" borderBottom="1px" borderColor="gray.200" boxShadow="sm">
        <Container maxW="4xl" mx="auto" py={6} px={4}>
          <HStack justify="space-between" align="center" mb={6}>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/recipes">
                <ArrowRight size={20} style={{ marginLeft: '8px' }} /> חזרה
              </Link>
            </Button>
            <HStack gap={2}>
              <Button asChild variant="outline" size="sm" colorPalette="orange">
                <Link href={`/dashboard/recipes/${recipe.id}/edit`}>
                  <Edit2 size={16} /> עריכה
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                colorPalette="red"
                onClick={handleDelete}
              >
                <Trash2 size={16} /> מחיקה
              </Button>
            </HStack>
          </HStack>

          <Stack gap={4}>
            <Heading size="2xl" fontWeight="extrabold" color="gray.800">
              {recipe.title}
            </Heading>
            {recipe.description && (
              <Text color="gray.600" fontSize="lg">
                {recipe.description}
              </Text>
            )}

            <HStack gap={6} flexWrap="wrap">
              <HStack gap={2} color="gray.600">
                <Users size={18} />
                <Text>{scaledServings} מנות</Text>
              </HStack>
              {recipe.prepTime && (
                <HStack gap={2} color="gray.600">
                  <Clock size={18} />
                  <Text>הכנה: {Math.round(recipe.prepTime * servingMultiplier)} דק'</Text>
                </HStack>
              )}
              {recipe.cookTime && (
                <HStack gap={2} color="gray.600">
                  <Clock size={18} />
                  <Text>בישול: {Math.round(recipe.cookTime * servingMultiplier)} דק'</Text>
                </HStack>
              )}
            </HStack>
          </Stack>
        </Container>
      </Box>

      {/* Content */}
      <Container maxW="4xl" mx="auto" py={10} px={4}>
        <Tabs.Root defaultValue="ingredients" variant="enclosed">
          <Tabs.List mb={6}>
            <Tabs.Trigger value="ingredients">מרכיבים</Tabs.Trigger>
            <Tabs.Trigger value="instructions">הוראות</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="ingredients">
            <Card.Root variant="elevated" boxShadow="sm">
              <Card.Header px={8} pt={8}>
                <HStack justify="space-between">
                  <Heading size="lg">מרכיבים</Heading>
                  <HStack gap={2}>
                    <Button size="sm" variant="outline" onClick={() => setServingMultiplier(s => Math.max(0.5, s - 0.5))}>
                      -
                    </Button>
                    <Text fontWeight="bold" minW="60px" textAlign="center">
                      ×{servingMultiplier.toFixed(1)}
                    </Text>
                    <Button size="sm" variant="outline" onClick={() => setServingMultiplier(s => s + 0.5)}>
                      +
                    </Button>
                  </HStack>
                </HStack>
              </Card.Header>
              <Card.Body px={8} pb={8}>
                <Stack gap={3}>
                  {recipe.recipeIngredients.map((ing, idx) => (
                    <HStack key={idx} justify="space-between" p={3} bg="gray.50" borderRadius="lg">
                      <Text>{ing.ingredient.name}</Text>
                      <Badge bg="orange.100" color="orange.700">
                        {(ing.amount * servingMultiplier).toFixed(2)} {ing.unit}
                      </Badge>
                    </HStack>
                  ))}
                </Stack>
              </Card.Body>
            </Card.Root>
          </Tabs.Content>

          <Tabs.Content value="instructions">
            <Card.Root variant="elevated" boxShadow="sm">
              <Card.Header px={8} pt={8}>
                <Heading size="lg">שלבי הכנה</Heading>
              </Card.Header>
              <Card.Body px={8} pb={8}>
                <Stack gap={6}>
                  {recipe.instructions
                    .sort((a, b) => a.order - b.order)
                    .map((inst, idx) => (
                      <HStack key={idx} gap={4} align="start">
                        <Badge bg="orange.500" color="white" borderRadius="full" minW="32px" h="32px" display="flex" alignItems="center" justifyContent="center">
                          {idx + 1}
                        </Badge>
                        <Text>{inst.content}</Text>
                      </HStack>
                    ))}
                </Stack>
              </Card.Body>
            </Card.Root>
          </Tabs.Content>
        </Tabs.Root>
      </Container>
    </Box>
  );
}
