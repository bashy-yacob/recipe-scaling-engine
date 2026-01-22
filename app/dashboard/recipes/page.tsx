'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Input,
  HStack,
  Stack,
  Badge,
  SimpleGrid,
  Card,
  Center,
  Spinner,
} from '@chakra-ui/react';
import Link from 'next/link';
import { Plus, Search, ChefHat, Sparkles, Heart, Tag, BookOpen, Link as LinkIcon, Image as ImageIcon, Clock, Users, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Recipe {
  id: string;
  title: string;
  description?: string;
  servings: number;
  prepTime?: number;
  cookTime?: number;
  isComplete?: boolean;
  recipeIngredients: Array<{ ingredient: { name: string } }>;
  instructions: Array<{ content: string }>;
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('/api/recipes');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <Box minH="100vh" bg="gray.50" dir="rtl" w="100%">
      {/* Header - חלק עליון */}
      <Box bg="white" borderBottom="1px" borderColor="gray.200" boxShadow="sm" w="100%">
        <Container maxW="5xl" mx="auto" py={12} px={6}>
          <Stack gap={8}>
            {/* כותרת וכפתור הוספה */}
            <HStack justify="space-between" align="center" flexWrap="wrap" gap={6}>
              <Stack gap={1}>
                <Heading size="2xl" fontWeight="extrabold" color="gray.800">
                  המתכונים שלי
                </Heading>
                <Text color="gray.500" fontSize="lg">
                  נהלי את ספר הבישול הדיגיטלי האישי שלך
                </Text>
              </Stack>
              <Button
                asChild
                bg="orange.500"
                color="white"
                _hover={{ bg: 'orange.600', transform: 'translateY(-2px)' }}
                size="lg"
                px={8}
                boxShadow="lg"
                borderRadius="xl"
              >
                <Link href="/dashboard/recipes/new">
                  <Plus size={20} style={{ marginLeft: '8px' }} />
                  מתכון חדש
                </Link>
              </Button>
            </HStack>

            {/* שורת חיפוש */}
            <Box position="relative" w="full" maxW="3xl" mx="auto"> 
              <Input
                placeholder="חפשי מתכון לפי שם, מרכיב או תגית..."
                size="xl"
                bg="gray.50"
                h="60px"
                borderRadius="2xl"
                fontSize="md"
                pr={14}
                borderWidth="2px"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                _focus={{ borderColor: 'orange.400', bg: 'white', boxShadow: '0 4px 20px rgba(249, 115, 22, 0.1)' }}
              />
              <Box
                position="absolute"
                right={5}
                top="50%"
                transform="translateY(-50%)"
                color="gray.400"
              >
                <Search size={24} />
              </Box>
            </Box>

            {/* סטטיסטיקות */}
            <Center>
              <HStack gap={{ base: 4, md: 10 }} flexWrap="wrap" justify="center">
                <StatItem icon={BookOpen} label="מתכונים" count={recipes.length} color="blue" />
                <StatItem icon={Heart} label="מועדפים" count={0} color="red" />
                <StatItem icon={Tag} label="תגיות" count={0} color="purple" />
              </HStack>
            </Center>
          </Stack>
        </Container>
      </Box>

      {/* Main Content Area - תוכן מרכזי */}
      <Container maxW="5xl" mx="auto" py={16} px={6}>
        {loading ? (
          <Center w="full" h="400px">
            <Spinner size="xl" color="orange.500" />
          </Center>
        ) : filteredRecipes.length === 0 ? (
          <Center w="full">
            <EmptyState />
          </Center>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            {filteredRecipes.map(recipe => (
              <Link href={`/dashboard/recipes/${recipe.id}`} key={recipe.id} style={{ textDecoration: 'none' }}>
                <Card.Root 
                  variant="outline" 
                  bg="white" 
                  borderRadius="2xl"
                  overflow="hidden"
                  transition="all 0.3s ease"
                  _hover={{
                    boxShadow: 'lg',
                    transform: 'translateY(-4px)',
                    borderColor: 'orange.300'
                  }}
                  h="full"
                >
                  <Card.Body p={6}>
                    <Stack gap={4} h="full">
                      <Stack gap={2}>
                        <HStack justify="space-between" align="start">
                          <Heading size="md" color="gray.800" lineClamp={2}>
                            {recipe.title}
                          </Heading>
                          {recipe.isComplete === false && (
                            <Badge 
                              bg="yellow.100" 
                              color="yellow.700" 
                              fontSize="xs"
                              px={2}
                              py={1}
                              borderRadius="md"
                              display="flex"
                              alignItems="center"
                              gap={1}
                              flexShrink={0}
                            >
                              <AlertTriangle size={12} />
                              לא מושלם
                            </Badge>
                          )}
                        </HStack>
                        {recipe.description && (
                          <Text color="gray.500" fontSize="sm" lineClamp={2}>
                            {recipe.description}
                          </Text>
                        )}
                      </Stack>

                      <HStack gap={4} fontSize="sm" color="gray.600">
                        <HStack gap={1}>
                          <Users size={16} />
                          <Text>{recipe.servings} מנות</Text>
                        </HStack>
                        {recipe.cookTime && (
                          <HStack gap={1}>
                            <Clock size={16} />
                            <Text>{recipe.cookTime} דקות</Text>
                          </HStack>
                        )}
                      </HStack>

                      <Stack gap={2} mt="auto">
                        <Text color="gray.500" fontSize="xs">
                          {recipe.recipeIngredients.length} מרכיבים
                        </Text>
                        <HStack gap={2} flexWrap="wrap">
                          {recipe.recipeIngredients.slice(0, 3).map((ing, idx) => (
                            <Badge key={idx} bg="orange.50" color="orange.600" fontSize="xs">
                              {ing.ingredient.name}
                            </Badge>
                          ))}
                          {recipe.recipeIngredients.length > 3 && (
                            <Badge bg="gray.100" color="gray.600" fontSize="xs">
                              +{recipe.recipeIngredients.length - 3} עוד
                            </Badge>
                          )}
                        </HStack>
                      </Stack>
                    </Stack>
                  </Card.Body>
                </Card.Root>
              </Link>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
}

function StatItem({ icon: Icon, label, count, color }: any) {
  return (
    <HStack gap={3} bg="white" px={5} py={2} borderRadius="2xl" border="1px solid" borderColor="gray.100" boxShadow="sm">
      <Center bg={`${color}.50`} color={`${color}.500`} p={2} borderRadius="lg">
        <Icon size={18} />
      </Center>
      <Stack gap={0}>
        <Text fontSize="xl" fontWeight="bold" lineHeight="1">{count}</Text>
        <Text fontSize="xs" color="gray.500" fontWeight="medium">{label}</Text>
      </Stack>
    </HStack>
  );
}

function EmptyState() {
  return (
    <Card.Root 
      variant="outline" 
      bg="white" 
      borderRadius="3xl" 
      borderStyle="dashed"
      borderWidth="2px"
      borderColor="gray.300"
      maxW="xl"
      w="full"
      boxShadow="none"
    >
      <Card.Body p={{ base: 8, md: 16 }}>
        <Stack gap={10} align="center" textAlign="center">
          <Box position="relative">
            <Center bg="orange.50" w="120px" h="120px" borderRadius="full">
              <ChefHat size={60} color="#f97316" strokeWidth={1.5} />
            </Center>
            <Box position="absolute" top={-2} right={-2} color="orange.400">
              <Sparkles size={32} />
            </Box>
          </Box>

          <Stack gap={3}>
            <Heading size="lg" fontWeight="bold" color="gray.800">התחילי לבנות את המטבח שלך</Heading>
            <Text color="gray.500" fontSize="lg">
              ספר המתכונים שלך כרגע ריק. הוסיפי את המתכון הראשון כדי להתחיל.
            </Text>
          </Stack>

          <Stack gap={4} w="full">
            <Button
              asChild
              bg="orange.500"
              color="white"
              _hover={{ bg: 'orange.600', transform: 'scale(1.02)' }}
              size="xl"
              h="60px"
              w="full"
              boxShadow="xl"
              borderRadius="2xl"
            >
              <Link href="/dashboard/recipes/new">
                <Plus size={22} style={{ marginLeft: '10px' }} />
                הוסיפי מתכון חדש
              </Link>
            </Button>

            <SimpleGrid columns={2} gap={4} w="full">
              <Button variant="outline" size="lg" h="56px" borderRadius="xl">
                <ImageIcon size={20} style={{ marginLeft: '8px' }} /> מתמונה
              </Button>
              <Button variant="outline" size="lg" h="56px" borderRadius="xl">
                <LinkIcon size={20} style={{ marginLeft: '8px' }} /> מכתובת URL
              </Button>
            </SimpleGrid>
          </Stack>

          <Box p={6} bg="blue.50" borderRadius="2xl" w="full" textAlign="right" border="1px solid" borderColor="blue.100">
            <HStack gap={2} mb={3} color="blue.700">
              <Sparkles size={18} />
              <Text fontSize="sm" fontWeight="bold">טיפ קטן:</Text>
            </HStack>
            <Stack gap={2} fontSize="sm" color="blue.800">
              <Text>• הדביקי קישור מבלוג או אתר - אנחנו כבר נארגן הכל.</Text>
              <Text>• צלמי דף מתוך ספר מתכונים - המערכת תזהה את הטקסט.</Text>
            </Stack>
          </Box>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}