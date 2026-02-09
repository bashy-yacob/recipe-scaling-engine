// src/pages/recipes/RecipeDetailsPage.tsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box, Container, Heading, Text, Button, HStack, Stack, Badge, SimpleGrid,
  Card, Center, Spinner, Tabs,
} from '@chakra-ui/react';
import { toaster } from '@/components/ui/toaster';
import { ArrowRight, Edit2, Trash2, Clock, Users } from 'lucide-react';
import { getRecipeById, deleteRecipe } from '@/lib/api/recipes';
import { ROUTES, getRecipeEditPath } from '@/router';
import type { Recipe } from '@/types/recipe';

export function RecipeDetailsPage() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [servingMultiplier, setServingMultiplier] = useState(1);

  const recipeId = params.id!;

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const result = await getRecipeById(recipeId);
        if (result.success && result.data) {
          setRecipe(result.data);
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
        toaster.create({ title: 'שגיאה בטעינה', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  const handleDelete = async () => {
    if (!confirm('בטוח שברצונך למחוק את המתכון?')) return;

    try {
      const result = await deleteRecipe(recipeId);
      if (!result.success) throw new Error(result.error);

      toaster.create({ title: 'המתכון נמחק בהצלחה', type: 'success' });
      navigate(ROUTES.RECIPES);
    } catch (error) {
      console.error('Error:', error);
      toaster.create({ title: 'שגיאה במחיקה', type: 'error' });
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
          <Link to={ROUTES.RECIPES}>חזרה למתכונים</Link>
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
              <Link to={ROUTES.RECIPES}>
                <ArrowRight size={20} style={{ marginLeft: '8px' }} /> חזרה
              </Link>
            </Button>
            <HStack gap={2}>
              <Button asChild variant="outline" size="sm" colorPalette="orange">
                <Link to={getRecipeEditPath(recipe.id)}>
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
                  <Text>הכנה: {recipe.prepTime} דק'</Text>
                </HStack>
              )}
              {recipe.cookTime && (
                <HStack gap={2} color="gray.600">
                  <Clock size={18} />
                  <Text>בישול: {recipe.cookTime} דק'</Text>
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
            {recipe.images && recipe.images.length > 0 && (
              <Tabs.Trigger value="images">תמונות ({recipe.images.length})</Tabs.Trigger>
            )}
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
                <Heading size="lg">הוראות הכנה</Heading>
              </Card.Header>
              <Card.Body px={8} pb={8}>
                <Stack gap={4}>
                  {recipe.instructions.map((inst, idx) => (
                    <HStack key={idx} align="start" gap={4} p={4} bg="gray.50" borderRadius="lg">
                      <Box
                        bg="orange.500"
                        color="white"
                        w="32px"
                        h="32px"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontWeight="bold"
                        flexShrink={0}
                      >
                        {idx + 1}
                      </Box>
                      <Text flex={1}>{inst.description || inst.content}</Text>
                    </HStack>
                  ))}
                </Stack>
              </Card.Body>
            </Card.Root>
          </Tabs.Content>

          {recipe.images && recipe.images.length > 0 && (
            <Tabs.Content value="images">
              <Card.Root variant="elevated" boxShadow="sm">
                <Card.Header px={8} pt={8}>
                  <Heading size="lg">תמונות</Heading>
                </Card.Header>
                <Card.Body px={8} pb={8}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                    {recipe.images.map((img) => (
                      <Box key={img.id} borderRadius="lg" overflow="hidden">
                        <img
                          src={img.url}
                          alt={img.caption || recipe.title}
                          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                        />
                        {img.caption && (
                          <Text p={2} fontSize="sm" color="gray.600" bg="gray.50">
                            {img.caption}
                          </Text>
                        )}
                      </Box>
                    ))}
                  </SimpleGrid>
                </Card.Body>
              </Card.Root>
            </Tabs.Content>
          )}
        </Tabs.Root>
      </Container>
    </Box>
  );
}
