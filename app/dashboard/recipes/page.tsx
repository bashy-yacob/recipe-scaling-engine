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
  Tabs,
} from '@chakra-ui/react';
import Link from 'next/link';
import { Plus, Search, ChefHat, Sparkles, Heart, Tag, BookOpen, Link as LinkIcon, Image as ImageIcon, Clock, Users, AlertTriangle, Globe, Lock, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toaster } from '@/components/ui/toaster';

interface Recipe {
  id: string;
  title: string;
  description?: string;
  servings: number;
  prepTime?: number;
  cookTime?: number;
  isComplete?: boolean;
  isPublic?: boolean;
  userId: string;
  recipeIngredients: Array<{ ingredient: { name: string } }>;
  instructions: Array<{ content: string }>;
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'mine' | 'public'>('mine');
  const router = useRouter();
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

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

  const togglePublish = async (e: React.MouseEvent, recipeId: string, currentlyPublic: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !currentlyPublic }),
      });
      
      if (!response.ok) throw new Error('Failed to update');
      
      setRecipes(prev => prev.map(r => 
        r.id === recipeId ? { ...r, isPublic: !currentlyPublic } : r
      ));
      
      toaster.success({
        title: currentlyPublic ? 'המתכון הפך לפרטי' : 'המתכון פורסם!',
        description: currentlyPublic ? 'רק את יכולה לראות אותו עכשיו' : 'עכשיו כולם יכולים לראות את המתכון',
      });
    } catch (error) {
      toaster.error({ title: 'שגיאה בעדכון המתכון' });
    }
  };

  // Filter recipes by search
  const searchFiltered = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Split into my recipes and public recipes
  const myRecipes = searchFiltered.filter(r => r.userId === currentUserId);
  const publicRecipes = searchFiltered.filter(r => r.isPublic && r.userId !== currentUserId);

  const displayedRecipes = activeTab === 'mine' ? myRecipes : publicRecipes;


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
                  ספר המתכונים
                </Heading>
                <Text color="gray.500" fontSize="lg">
                  המתכונים שלך והמתכונים של הקהילה
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

            {/* טאבים - המתכונים שלי / ציבוריים */}
            <Center>
              <HStack gap={4} bg="gray.100" p={1} borderRadius="xl">
                <Button
                  onClick={() => setActiveTab('mine')}
                  bg={activeTab === 'mine' ? 'white' : 'transparent'}
                  color={activeTab === 'mine' ? 'orange.600' : 'gray.600'}
                  boxShadow={activeTab === 'mine' ? 'sm' : 'none'}
                  _hover={{ bg: activeTab === 'mine' ? 'white' : 'gray.200' }}
                  borderRadius="lg"
                  px={6}
                  py={2}
                >
                  <BookOpen size={18} style={{ marginLeft: '8px' }} />
                  המתכונים שלי ({myRecipes.length})
                </Button>
                <Button
                  onClick={() => setActiveTab('public')}
                  bg={activeTab === 'public' ? 'white' : 'transparent'}
                  color={activeTab === 'public' ? 'green.600' : 'gray.600'}
                  boxShadow={activeTab === 'public' ? 'sm' : 'none'}
                  _hover={{ bg: activeTab === 'public' ? 'white' : 'gray.200' }}
                  borderRadius="lg"
                  px={6}
                  py={2}
                >
                  <Globe size={18} style={{ marginLeft: '8px' }} />
                  מתכונים ציבוריים ({publicRecipes.length})
                </Button>
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
        ) : displayedRecipes.length === 0 ? (
          <Center w="full">
            {activeTab === 'mine' ? <EmptyState /> : <EmptyPublicState />}
          </Center>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            {displayedRecipes.map(recipe => (
              <Box key={recipe.id} position="relative">
                <Link href={`/dashboard/recipes/${recipe.id}`} style={{ textDecoration: 'none' }}>
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
                            <HStack gap={1} flexShrink={0}>
                              {recipe.isPublic ? (
                                <Badge bg="green.100" color="green.700" fontSize="xs" px={2} py={1} borderRadius="md">
                                  <Globe size={12} style={{ marginLeft: '4px' }} />
                                  ציבורי
                                </Badge>
                              ) : (
                                <Badge bg="gray.100" color="gray.600" fontSize="xs" px={2} py={1} borderRadius="md">
                                  <Lock size={12} style={{ marginLeft: '4px' }} />
                                  פרטי
                                </Badge>
                              )}
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
                                >
                                  <AlertTriangle size={12} />
                                  לא מושלם
                                </Badge>
                              )}
                            </HStack>
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
                
                {/* Publish/Unpublish button - only for owner */}
                {recipe.userId === currentUserId && (
                  <Button
                    position="absolute"
                    top={3}
                    left={3}
                    size="sm"
                    variant={recipe.isPublic ? 'outline' : 'solid'}
                    bg={recipe.isPublic ? 'white' : 'green.500'}
                    color={recipe.isPublic ? 'gray.600' : 'white'}
                    borderColor={recipe.isPublic ? 'gray.300' : undefined}
                    _hover={{ 
                      bg: recipe.isPublic ? 'gray.100' : 'green.600',
                      transform: 'scale(1.05)'
                    }}
                    borderRadius="lg"
                    boxShadow="md"
                    onClick={(e) => togglePublish(e, recipe.id, recipe.isPublic || false)}
                  >
                    {recipe.isPublic ? (
                      <>
                        <Lock size={14} style={{ marginLeft: '4px' }} />
                        הפוך לפרטי
                      </>
                    ) : (
                      <>
                        <Globe size={14} style={{ marginLeft: '4px' }} />
                        פרסם
                      </>
                    )}
                  </Button>
                )}
              </Box>
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

function EmptyPublicState() {
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
        <Stack gap={8} align="center" textAlign="center">
          <Center bg="green.50" w="100px" h="100px" borderRadius="full">
            <Globe size={50} color="#22c55e" strokeWidth={1.5} />
          </Center>
          <Stack gap={3}>
            <Heading size="lg" fontWeight="bold" color="gray.800">אין עדיין מתכונים ציבוריים</Heading>
            <Text color="gray.500" fontSize="lg">
              כשמישהו יפרסם מתכון, הוא יופיע כאן לכולם.
            </Text>
          </Stack>
        </Stack>
      </Card.Body>
    </Card.Root>
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