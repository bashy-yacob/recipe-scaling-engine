// src/pages/recipes/RecipeDetailsPage.tsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box, Container, Heading, Text, Button, HStack, Stack, Badge, SimpleGrid,
  Card, Center, Tabs, Skeleton,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { toaster } from '@/components/ui/toaster';
import { ArrowRight, Edit2, Trash2, Clock, Users } from 'lucide-react';
import { getRecipeById, deleteRecipe } from '@/lib/api/recipes';
import { ROUTES, getRecipeEditPath } from '@/router';
import type { Recipe } from '@/types/recipe';

const MotionBox = motion.create(Box);

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
      <Box bg="bg.page" minH="100vh" dir="rtl">
        <Box bg="bg.surface" borderBottom="1px solid" borderColor="border.muted">
          <Container maxW="4xl" mx="auto" py={6} px={4}>
            <Stack gap={3}>
              <Skeleton h="32px" w="300px" borderRadius="lg" />
              <Skeleton h="20px" w="200px" borderRadius="lg" />
            </Stack>
          </Container>
        </Box>
        <Container maxW="4xl" mx="auto" py={8} px={4}>
          <Skeleton h="300px" borderRadius="xl" />
        </Container>
      </Box>
    );
  }

  if (!recipe) {
    return (
      <Center w="full" h="100vh" flexDirection="column" gap={4} bg="bg.page">
        <Heading color="fg.heading">המתכון לא נמצא</Heading>
        <Button asChild variant="outline" borderRadius="lg">
          <Link to={ROUTES.RECIPES}>חזרה למתכונים</Link>
        </Button>
      </Center>
    );
  }

  const scaledServings = recipe.servings * servingMultiplier;

  return (
    <Box minH="100vh" bg="bg.page" dir="rtl">
      {/* Header */}
      <Box bg="bg.surface" borderBottom="1px solid" borderColor="border.muted">
        <Container maxW="4xl" mx="auto" py={5} px={4}>
          <HStack justify="space-between" align="center" mb={4}>
            <Button asChild variant="ghost" size="sm" color="fg.muted" _hover={{ color: 'fg.default' }}>
              <Link to={ROUTES.RECIPES}>
                <ArrowRight size={18} />
                <Text ms={1}>חזרה</Text>
              </Link>
            </Button>
            <HStack gap={2}>
              <Button asChild variant="outline" size="sm" borderRadius="lg" borderColor="border.default" color="fg.default" _hover={{ bg: 'bg.muted' }}>
                <Link to={getRecipeEditPath(recipe.id)}>
                  <Edit2 size={14} />
                  <Text ms={1}>עריכה</Text>
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                color="red.500"
                _hover={{ bg: 'red.50' }}
                onClick={handleDelete}
              >
                <Trash2 size={14} />
                <Text ms={1}>מחיקה</Text>
              </Button>
            </HStack>
          </HStack>

          <MotionBox initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Stack gap={3}>
              <Heading size="2xl" fontWeight="bold" color="fg.heading">
                {recipe.title}
              </Heading>
              {recipe.description && (
                <Text color="fg.muted" fontSize="md">
                  {recipe.description}
                </Text>
              )}

              <HStack gap={5} flexWrap="wrap">
                <HStack gap={1.5} color="fg.muted" fontSize="sm">
                  <Users size={16} />
                  <Text>{scaledServings} מנות</Text>
                </HStack>
                {recipe.prepTime && (
                  <HStack gap={1.5} color="fg.muted" fontSize="sm">
                    <Clock size={16} />
                    <Text>הכנה: {recipe.prepTime} דק'</Text>
                  </HStack>
                )}
                {recipe.cookTime && (
                  <HStack gap={1.5} color="fg.muted" fontSize="sm">
                    <Clock size={16} />
                    <Text>בישול: {recipe.cookTime} דק'</Text>
                  </HStack>
                )}
              </HStack>
            </Stack>
          </MotionBox>
        </Container>
      </Box>

      {/* Content */}
      <Container maxW="4xl" mx="auto" py={8} px={4}>
        <Tabs.Root defaultValue="ingredients" variant="enclosed">
          <Tabs.List mb={5}>
            <Tabs.Trigger value="ingredients">מרכיבים</Tabs.Trigger>
            <Tabs.Trigger value="instructions">הוראות</Tabs.Trigger>
            {recipe.images && recipe.images.length > 0 && (
              <Tabs.Trigger value="images">תמונות ({recipe.images.length})</Tabs.Trigger>
            )}
          </Tabs.List>

          <Tabs.Content value="ingredients">
            <Card.Root variant="outline" borderColor="border.default" bg="bg.surface" borderRadius="xl">
              <Card.Header px={6} pt={6}>
                <HStack justify="space-between">
                  <Heading size="md" color="fg.heading">מרכיבים</Heading>
                  <HStack gap={2}>
                    <Button size="sm" variant="outline" borderRadius="lg" borderColor="border.default" onClick={() => setServingMultiplier(s => Math.max(0.5, s - 0.5))}>
                      -
                    </Button>
                    <Text fontWeight="bold" minW="50px" textAlign="center" fontSize="sm" color="fg.default">
                      ×{servingMultiplier.toFixed(1)}
                    </Text>
                    <Button size="sm" variant="outline" borderRadius="lg" borderColor="border.default" onClick={() => setServingMultiplier(s => s + 0.5)}>
                      +
                    </Button>
                  </HStack>
                </HStack>
              </Card.Header>
              <Card.Body px={6} pb={6}>
                <Stack gap={2}>
                  {recipe.recipeIngredients.map((ing, idx) => (
                    <HStack key={idx} justify="space-between" p={3} bg="bg.subtle" borderRadius="lg">
                      <Text color="fg.default" fontSize="sm">{ing.ingredient.name}</Text>
                      <Badge bg="bg.brand.subtle" color="fg.brand" borderRadius="md" fontSize="xs">
                        {(ing.amount * servingMultiplier).toFixed(2)} {ing.unit}
                      </Badge>
                    </HStack>
                  ))}
                </Stack>
              </Card.Body>
            </Card.Root>
          </Tabs.Content>

          <Tabs.Content value="instructions">
            <Card.Root variant="outline" borderColor="border.default" bg="bg.surface" borderRadius="xl">
              <Card.Header px={6} pt={6}>
                <Heading size="md" color="fg.heading">הוראות הכנה</Heading>
              </Card.Header>
              <Card.Body px={6} pb={6}>
                <Stack gap={3}>
                  {recipe.instructions.map((inst, idx) => (
                    <HStack key={idx} align="start" gap={3} p={3} bg="bg.subtle" borderRadius="lg">
                      <Box
                        bg="brand.500"
                        color="white"
                        w="28px"
                        h="28px"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontWeight="bold"
                        fontSize="sm"
                        flexShrink={0}
                      >
                        {idx + 1}
                      </Box>
                      <Text flex={1} color="fg.default" fontSize="sm">{inst.description || inst.content}</Text>
                    </HStack>
                  ))}
                </Stack>
              </Card.Body>
            </Card.Root>
          </Tabs.Content>

          {recipe.images && recipe.images.length > 0 && (
            <Tabs.Content value="images">
              <Card.Root variant="outline" borderColor="border.default" bg="bg.surface" borderRadius="xl">
                <Card.Header px={6} pt={6}>
                  <Heading size="md" color="fg.heading">תמונות</Heading>
                </Card.Header>
                <Card.Body px={6} pb={6}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                    {recipe.images.map((img) => (
                      <Box key={img.id} borderRadius="lg" overflow="hidden" borderWidth="1px" borderColor="border.default">
                        <img
                          src={img.url}
                          alt={img.caption || recipe.title}
                          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                        />
                        {img.caption && (
                          <Text p={2} fontSize="sm" color="fg.muted" bg="bg.subtle">
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
