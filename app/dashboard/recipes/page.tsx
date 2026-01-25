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
  Select,
  createListCollection,
} from '@chakra-ui/react';
import Link from 'next/link';
import { Plus, Search, ChefHat, Sparkles, Heart, Tag, BookOpen, Link as LinkIcon, Image as ImageIcon, Clock, Users, AlertTriangle, Globe, Lock, Eye, Filter, ArrowUpDown, X } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
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
  difficulty?: string;
  category?: string;
  isComplete?: boolean;
  isPublic?: boolean;
  userId: string;
  likeCount: number;
  isLiked: boolean;
  user?: { id: string; name?: string };
  recipeIngredients: Array<{ ingredient: { name: string } }>;
  instructions: Array<{ content: string }>;
}

// Sort options
const sortOptions = createListCollection({
  items: [
    { label: 'תאריך יצירה (חדש → ישן)', value: 'createdAt-desc' },
    { label: 'תאריך יצירה (ישן → חדש)', value: 'createdAt-asc' },
    { label: 'שם (א-ת)', value: 'title-asc' },
    { label: 'שם (ת-א)', value: 'title-desc' },
    { label: 'זמן הכנה (קצר → ארוך)', value: 'prepTime-asc' },
    { label: 'זמן הכנה (ארוך → קצר)', value: 'prepTime-desc' },
    { label: 'מנות (פחות → יותר)', value: 'servings-asc' },
    { label: 'מנות (יותר → פחות)', value: 'servings-desc' },
    { label: 'לייקים (הכי פופולרי)', value: 'likes-desc' },
    { label: 'לייקים (הכי פחות)', value: 'likes-asc' },
  ],
});

const difficultyOptions = createListCollection({
  items: [
    { label: 'כל הרמות', value: '' },
    { label: '🟢 קל', value: 'easy' },
    { label: '🟡 בינוני', value: 'medium' },
    { label: '🔴 קשה', value: 'hard' },
  ],
});

const categoryOptions = createListCollection({
  items: [
    { label: 'כל הקטגוריות', value: '' },
    { label: '🍽️ מנה עיקרית', value: 'main' },
    { label: '🍰 קינוח', value: 'dessert' },
    { label: '🥗 מנה ראשונה', value: 'appetizer' },
    { label: '🥣 מרק', value: 'soup' },
    { label: '🥪 ארוחת בוקר', value: 'breakfast' },
    { label: '🍞 לחם ומאפים', value: 'bread' },
    { label: '🥤 משקאות', value: 'drinks' },
  ],
});

const timeOptions = createListCollection({
  items: [
    { label: 'ללא הגבלה', value: '' },
    { label: 'עד 15 דקות', value: '15' },
    { label: 'עד 30 דקות', value: '30' },
    { label: 'עד 45 דקות', value: '45' },
    { label: 'עד שעה', value: '60' },
    { label: 'עד שעתיים', value: '120' },
  ],
});

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'mine' | 'public'>('mine');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter & Sort state
  const [sortBy, setSortBy] = useState('createdAt-desc');
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState('');
  const [maxPrepTime, setMaxPrepTime] = useState('');
  const [maxCookTime, setMaxCookTime] = useState('');
  
  const router = useRouter();
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      const [sortField, sortOrder] = sortBy.split('-');
      const params = new URLSearchParams();
      
      params.set('sortBy', sortField);
      params.set('sortOrder', sortOrder);
      if (difficulty) params.set('difficulty', difficulty);
      if (category) params.set('category', category);
      if (maxPrepTime) params.set('maxPrepTime', maxPrepTime);
      if (maxCookTime) params.set('maxCookTime', maxCookTime);
      if (searchQuery) params.set('search', searchQuery);
      
      const response = await fetch(`/api/recipes?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  }, [sortBy, difficulty, category, maxPrepTime, maxCookTime, searchQuery]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

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

  const toggleLike = async (e: React.MouseEvent, recipeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUserId) {
      toaster.error({ title: 'יש להתחבר כדי לסמן לייק' });
      return;
    }
    
    try {
      const response = await fetch(`/api/recipes/${recipeId}/like`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to toggle like');
      
      const data = await response.json();
      
      setRecipes(prev => prev.map(r => 
        r.id === recipeId 
          ? { ...r, isLiked: data.liked, likeCount: data.likeCount } 
          : r
      ));
      
      toaster.success({
        title: data.liked ? '❤️ נוסף למועדפים!' : '💔 הוסר מהמועדפים',
      });
    } catch (error) {
      toaster.error({ title: 'שגיאה בעדכון הלייק' });
    }
  };

  const clearFilters = () => {
    setDifficulty('');
    setCategory('');
    setMaxPrepTime('');
    setMaxCookTime('');
    setSortBy('createdAt-desc');
  };

  const hasActiveFilters = difficulty || category || maxPrepTime || maxCookTime;

  // Split into my recipes and public recipes
  const myRecipes = recipes.filter(r => r.userId === currentUserId);
  const publicRecipes = recipes.filter(r => r.isPublic);

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
                placeholder="חפשי מתכון לפי שם או תיאור..."
                size="xl"
                bg="gray.50"
                h="60px"
                borderRadius="2xl"
                fontSize="md"
                pr={14}
                borderWidth="2px"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchRecipes()}
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

            {/* כפתור פילטרים */}
            <Center>
              <HStack gap={3}>
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant={showFilters ? 'solid' : 'outline'}
                  bg={showFilters ? 'orange.500' : 'white'}
                  color={showFilters ? 'white' : 'gray.700'}
                  _hover={{ bg: showFilters ? 'orange.600' : 'gray.100' }}
                  borderRadius="xl"
                  px={5}
                >
                  <Filter size={18} style={{ marginLeft: '8px' }} />
                  סינון ומיון
                  {hasActiveFilters && (
                    <Badge bg="red.500" color="white" borderRadius="full" mr={2} fontSize="xs">!</Badge>
                  )}
                </Button>
                {hasActiveFilters && (
                  <Button
                    onClick={clearFilters}
                    variant="ghost"
                    color="red.500"
                    size="sm"
                    _hover={{ bg: 'red.50' }}
                  >
                    <X size={16} style={{ marginLeft: '4px' }} />
                    נקה פילטרים
                  </Button>
                )}
              </HStack>
            </Center>

            {/* פאנל פילטרים */}
            {showFilters && (
              <Box 
                bg="white" 
                p={6} 
                borderRadius="2xl" 
                boxShadow="md"
                border="1px solid"
                borderColor="gray.200"
              >
                <Stack gap={5}>
                  {/* מיון */}
                  <Box>
                    <Text fontWeight="bold" color="gray.700" mb={2} fontSize="sm">
                      <ArrowUpDown size={16} style={{ display: 'inline', marginLeft: '6px' }} />
                      מיון לפי
                    </Text>
                    <Select.Root
                      collection={sortOptions}
                      value={[sortBy]}
                      onValueChange={(e) => setSortBy(e.value[0])}
                      size="md"
                    >
                      <Select.Trigger bg="gray.50" borderRadius="xl">
                        <Select.ValueText placeholder="בחרי מיון" />
                      </Select.Trigger>
                      <Select.Content>
                        {sortOptions.items.map((option) => (
                          <Select.Item key={option.value} item={option}>
                            {option.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </Box>

                  <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
                    {/* רמת קושי */}
                    <Box>
                      <Text fontWeight="medium" color="gray.600" mb={2} fontSize="sm">רמת קושי</Text>
                      <Select.Root
                        collection={difficultyOptions}
                        value={[difficulty]}
                        onValueChange={(e) => setDifficulty(e.value[0])}
                        size="sm"
                      >
                        <Select.Trigger bg="gray.50" borderRadius="lg">
                          <Select.ValueText placeholder="כל הרמות" />
                        </Select.Trigger>
                        <Select.Content>
                          {difficultyOptions.items.map((option) => (
                            <Select.Item key={option.value} item={option}>
                              {option.label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    </Box>

                    {/* קטגוריה */}
                    <Box>
                      <Text fontWeight="medium" color="gray.600" mb={2} fontSize="sm">קטגוריה</Text>
                      <Select.Root
                        collection={categoryOptions}
                        value={[category]}
                        onValueChange={(e) => setCategory(e.value[0])}
                        size="sm"
                      >
                        <Select.Trigger bg="gray.50" borderRadius="lg">
                          <Select.ValueText placeholder="כל הקטגוריות" />
                        </Select.Trigger>
                        <Select.Content>
                          {categoryOptions.items.map((option) => (
                            <Select.Item key={option.value} item={option}>
                              {option.label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    </Box>

                    {/* זמן הכנה מקסימלי */}
                    <Box>
                      <Text fontWeight="medium" color="gray.600" mb={2} fontSize="sm">זמן הכנה מקס&apos;</Text>
                      <Select.Root
                        collection={timeOptions}
                        value={[maxPrepTime]}
                        onValueChange={(e) => setMaxPrepTime(e.value[0])}
                        size="sm"
                      >
                        <Select.Trigger bg="gray.50" borderRadius="lg">
                          <Select.ValueText placeholder="ללא הגבלה" />
                        </Select.Trigger>
                        <Select.Content>
                          {timeOptions.items.map((option) => (
                            <Select.Item key={option.value} item={option}>
                              {option.label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    </Box>

                    {/* זמן בישול מקסימלי */}
                    <Box>
                      <Text fontWeight="medium" color="gray.600" mb={2} fontSize="sm">זמן בישול מקס&apos;</Text>
                      <Select.Root
                        collection={timeOptions}
                        value={[maxCookTime]}
                        onValueChange={(e) => setMaxCookTime(e.value[0])}
                        size="sm"
                      >
                        <Select.Trigger bg="gray.50" borderRadius="lg">
                          <Select.ValueText placeholder="ללא הגבלה" />
                        </Select.Trigger>
                        <Select.Content>
                          {timeOptions.items.map((option) => (
                            <Select.Item key={option.value} item={option}>
                              {option.label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    </Box>
                  </SimpleGrid>
                </Stack>
              </Box>
            )}
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
                    overflow="hidden" 
                    borderRadius="3xl" 
                    boxShadow="xl" 
                    border="none" 
                    transition="all 0.3s" 
                    _hover={{ transform: 'translateY(-8px)' }}
                    h="full"
                    bg="white"
                  >
                    <Box h="200px" bgGradient="to-br" gradientFrom="orange.400" gradientTo="yellow.400" position="relative">
                      <Center h="full">
                        <ChefHat size={60} color="white" opacity={0.3} />
                      </Center>
                      <HStack position="absolute" top={4} right={4} gap={2}>
                        {recipe.difficulty && (
                            <Badge 
                                bg="white" color={recipe.difficulty === 'easy' ? 'green.600' : recipe.difficulty === 'medium' ? 'yellow.600' : 'red.600'} 
                                borderRadius="lg" px={3} py={1} boxShadow="sm"
                            >
                                {recipe.difficulty === 'easy' ? 'קל להכנה' : recipe.difficulty === 'medium' ? 'בינוני' : 'למתקדמים'}
                            </Badge>
                        )}
                        {recipe.isPublic ? (
                            <Badge bg="white" color="green.700" borderRadius="lg" px={3} py={1} boxShadow="sm">
                                <Globe size={12} style={{ marginLeft: '4px', display: 'inline' }} />
                                ציבורי
                            </Badge>
                        ) : (
                             <Badge bg="white" color="gray.600" borderRadius="lg" px={3} py={1} boxShadow="sm">
                                <Lock size={12} style={{ marginLeft: '4px', display: 'inline' }} />
                                פרטי
                            </Badge>
                        )}
                         {recipe.isComplete === false && (
                                <Badge 
                                  bg="white" 
                                  color="red.600" 
                                  borderRadius="lg" px={3} py={1} boxShadow="sm"
                                  display="flex"
                                  alignItems="center"
                                  gap={1}
                                >
                                  <AlertTriangle size={12} />
                                  לא מושלם
                                </Badge>
                        )}
                      </HStack>
                    </Box>

                    <Card.Body p={6}>
                      <Stack gap={4} h="full">
                        <HStack justify="space-between" align="start">
                          <Heading size="md" fontWeight="bold" lineClamp={2} color="gray.800">
                             {recipe.title}
                          </Heading>
                          <HStack gap={1} bg="red.50" px={2} py={1} borderRadius="md" color={recipe.isLiked ? 'red.500' : 'gray.400'}>
                             <Heart size={14} fill={recipe.isLiked ? 'currentColor' : 'none'} />
                             <Text fontWeight="bold" fontSize="xs" color="red.700">{recipe.likeCount}</Text>
                          </HStack>
                        </HStack>
                        
                        {recipe.description && (
                          <Text fontSize="sm" color="gray.500" lineClamp={2}>
                             {recipe.description}
                          </Text>
                        )}

                        <HStack gap={2} flexWrap="wrap">
                       {/* Category */}
                       {recipe.category && (
                            <Badge bg="purple.50" color="purple.700" borderRadius="md" px={2}>
                                 {recipe.category === 'main' ? '🍽️ מנה עיקרית' :
                                  recipe.category === 'dessert' ? '🍰 קינוח' :
                                  recipe.category === 'appetizer' ? '🥗 מנה ראשונה' :
                                  recipe.category === 'soup' ? '🥣 מרק' :
                                  recipe.category === 'breakfast' ? '🥪 ארוחת בוקר' :
                                  recipe.category === 'bread' ? '🍞 לחם' :
                                  recipe.category === 'drinks' ? '🥤 משקה' : recipe.category}
                            </Badge>
                       )}
                       </HStack>

                        <HStack gap={4} pt={2} mt="auto" borderTopWidth="1px" borderColor="gray.100">
                          {(recipe.prepTime || recipe.cookTime) && (
                            <HStack gap={1} color="gray.400">
                                <Clock size={16} />
                                <Text fontSize="xs">{(recipe.prepTime || 0) + (recipe.cookTime || 0)} דק'</Text>
                            </HStack>
                          )}
                          <HStack gap={1} color="gray.400">
                             <Users size={16} />
                             <Text fontSize="xs">{recipe.servings} מנות</Text>
                          </HStack>
                           
                           {/* Ingredients summary */}
                           <Text fontSize="xs" color="gray.300" mr="auto">
                              {recipe.recipeIngredients.length} מרכיבים
                           </Text>
                        </HStack>
                      </Stack>
                    </Card.Body>
                  </Card.Root>
                </Link>
                
                {/* Like button - for public recipes */}
                {(recipe.isPublic || recipe.userId !== currentUserId) && (
                  <Button
                    position="absolute"
                    bottom={3}
                    left={3}
                    size="sm"
                    variant="ghost"
                    bg={recipe.isLiked ? 'red.50' : 'white'}
                    color={recipe.isLiked ? 'red.500' : 'gray.500'}
                    _hover={{ 
                      bg: recipe.isLiked ? 'red.100' : 'gray.100',
                      transform: 'scale(1.1)'
                    }}
                    borderRadius="full"
                    boxShadow="md"
                    p={2}
                    minW="auto"
                    onClick={(e) => toggleLike(e, recipe.id)}
                  >
                    <Heart size={18} fill={recipe.isLiked ? 'currentColor' : 'none'} />
                  </Button>
                )}
                
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