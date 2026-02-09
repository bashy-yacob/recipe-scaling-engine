// src/pages/recipes/RecipeListPage.tsx

import { useState, useEffect, useCallback } from 'react';
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
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, ChefHat, Heart, Clock, Users, Globe, Lock, Filter } from 'lucide-react';
import { toaster } from '@/components/ui/toaster';
import { getRecipes, toggleRecipeLike, toggleRecipePublic } from '@/lib/api/recipes';
import { ROUTES, getRecipeDetailsPath } from '@/router';
import type { RecipeListItem } from '@/types/recipe';

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

export function RecipeListPage() {
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'mine' | 'public'>('mine');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter & Sort state
  const [sortBy, setSortBy] = useState('createdAt-desc');
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState('');
  
  const navigate = useNavigate();

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      const [sortField, sortOrder] = sortBy.split('-');
      
      const result = await getRecipes({
        sortBy: sortField,
        sortOrder: sortOrder as 'asc' | 'desc',
        difficulty,
        category,
        search: searchQuery,
      });
      
      if (result.success && result.data) {
        setRecipes(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toaster.create({ title: 'שגיאה בטעינת המתכונים', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [sortBy, difficulty, category, searchQuery]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleTogglePublish = async (e: React.MouseEvent, recipeId: string, currentlyPublic: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const result = await toggleRecipePublic(recipeId, !currentlyPublic);
      if (result.success) {
        setRecipes(prev => prev.map(r => 
          r.id === recipeId ? { ...r, isPublic: !currentlyPublic } : r
        ));
        toaster.create({ 
          title: currentlyPublic ? 'המתכון הועבר לפרטי' : 'המתכון פורסם!', 
          type: 'success' 
        });
      }
    } catch (error) {
      toaster.create({ title: 'שגיאה בעדכון', type: 'error' });
    }
  };

  const handleToggleLike = async (e: React.MouseEvent, recipeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const result = await toggleRecipeLike(recipeId);
      if (result.success && result.data) {
        setRecipes(prev => prev.map(r => 
          r.id === recipeId ? { ...r, isLiked: result.data!.liked, likeCount: result.data!.likeCount } : r
        ));
      }
    } catch (error) {
      toaster.create({ title: 'שגיאה', type: 'error' });
    }
  };

  // Filter recipes based on active tab
  const filteredRecipes = recipes.filter(recipe => {
    if (activeTab === 'public') {
      return recipe.isPublic;
    }
    return true; // 'mine' shows all user's recipes
  });

  if (loading) {
    return (
      <Center w="full" h="80vh">
        <Spinner size="xl" color="orange.500" />
      </Center>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50" dir="rtl">
      {/* Header */}
      <Box bg="white" borderBottom="1px" borderColor="gray.200" boxShadow="sm">
        <Container maxW="5xl" mx="auto" py={10} px={6}>
          <HStack justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <Stack gap={1}>
              <Heading size="2xl" fontWeight="extrabold" color="gray.900">
                המתכונים שלי
              </Heading>
              <Text color="gray.500" fontSize="lg">
                {recipes.length} מתכונים בספרייה
              </Text>
            </Stack>
            
            <Button
              asChild
              bg="orange.500"
              color="white"
              size="lg"
              borderRadius="xl"
              px={6}
              boxShadow="lg"
              _hover={{ bg: 'orange.600', transform: 'translateY(-2px)' }}
            >
              <Link to={ROUTES.RECIPE_NEW}>
                <Plus size={20} style={{ marginLeft: '8px' }} />
                מתכון חדש
              </Link>
            </Button>
          </HStack>
        </Container>
      </Box>

      {/* Search & Filters */}
      <Container maxW="5xl" mx="auto" py={6} px={6}>
        <Stack gap={4}>
          {/* Search Bar */}
          <HStack gap={4}>
            <Box position="relative" flex={1}>
              <Box position="absolute" right={3} top="50%" transform="translateY(-50%)" zIndex={2}>
                <Search size={18} color="#a0aec0" />
              </Box>
              <Input
                placeholder="חיפוש מתכונים..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                pr={10}
                size="lg"
                borderRadius="xl"
                bg="white"
              />
            </Box>
            <Button
              variant="outline"
              size="lg"
              borderRadius="xl"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} style={{ marginLeft: '8px' }} />
              פילטרים
            </Button>
          </HStack>

          {/* Filters Panel */}
          {showFilters && (
            <Card.Root variant="outline" borderRadius="xl">
              <Card.Body p={4}>
                <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>מיון</Text>
                    <Select.Root
                      collection={sortOptions}
                      value={[sortBy]}
                      onValueChange={(e) => setSortBy(e.value[0])}
                    >
                      <Select.Trigger />
                      <Select.Content>
                        {sortOptions.items.map((item) => (
                          <Select.Item key={item.value} item={item}>
                            {item.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>רמת קושי</Text>
                    <Select.Root
                      collection={difficultyOptions}
                      value={[difficulty]}
                      onValueChange={(e) => setDifficulty(e.value[0])}
                    >
                      <Select.Trigger />
                      <Select.Content>
                        {difficultyOptions.items.map((item) => (
                          <Select.Item key={item.value} item={item}>
                            {item.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>קטגוריה</Text>
                    <Select.Root
                      collection={categoryOptions}
                      value={[category]}
                      onValueChange={(e) => setCategory(e.value[0])}
                    >
                      <Select.Trigger />
                      <Select.Content>
                        {categoryOptions.items.map((item) => (
                          <Select.Item key={item.value} item={item}>
                            {item.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </Box>
                </SimpleGrid>
              </Card.Body>
            </Card.Root>
          )}

          {/* Tabs */}
          <Tabs.Root value={activeTab} onValueChange={(e) => setActiveTab(e.value as 'mine' | 'public')}>
            <Tabs.List>
              <Tabs.Trigger value="mine">המתכונים שלי</Tabs.Trigger>
              <Tabs.Trigger value="public">מתכונים ציבוריים</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </Stack>
      </Container>

      {/* Recipe Grid */}
      <Container maxW="5xl" mx="auto" pb={12} px={6}>
        {filteredRecipes.length === 0 ? (
          <Center py={20}>
            <Stack align="center" gap={4}>
              <ChefHat size={64} color="#cbd5e0" />
              <Text color="gray.500" fontSize="lg">
                {searchQuery ? 'לא נמצאו מתכונים התואמים לחיפוש' : 'אין מתכונים עדיין'}
              </Text>
              <Button asChild colorPalette="orange">
                <Link to={ROUTES.RECIPE_NEW}>הוסף מתכון ראשון</Link>
              </Button>
            </Stack>
          </Center>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onTogglePublish={handleTogglePublish}
                onToggleLike={handleToggleLike}
                onClick={() => navigate(getRecipeDetailsPath(recipe.id))}
              />
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
}

// Recipe Card Component
interface RecipeCardProps {
  recipe: RecipeListItem;
  onTogglePublish: (e: React.MouseEvent, id: string, isPublic: boolean) => void;
  onToggleLike: (e: React.MouseEvent, id: string) => void;
  onClick: () => void;
}

function RecipeCard({ recipe, onTogglePublish, onToggleLike, onClick }: RecipeCardProps) {
  return (
    <Card.Root
      variant="elevated"
      borderRadius="2xl"
      overflow="hidden"
      cursor="pointer"
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
      onClick={onClick}
    >
      <Card.Body p={6}>
        <Stack gap={4}>
          <HStack justify="space-between">
            <Heading size="md" lineClamp={1}>{recipe.title}</Heading>
            <HStack gap={1}>
              <Button
                size="xs"
                variant="ghost"
                onClick={(e) => onToggleLike(e, recipe.id)}
                color={recipe.isLiked ? 'red.500' : 'gray.400'}
              >
                <Heart size={16} fill={recipe.isLiked ? 'currentColor' : 'none'} />
                <Text>{recipe.likeCount}</Text>
              </Button>
              <Button
                size="xs"
                variant="ghost"
                onClick={(e) => onTogglePublish(e, recipe.id, recipe.isPublic || false)}
                color={recipe.isPublic ? 'green.500' : 'gray.400'}
              >
                {recipe.isPublic ? <Globe size={16} /> : <Lock size={16} />}
              </Button>
            </HStack>
          </HStack>

          {recipe.description && (
            <Text color="gray.500" fontSize="sm" lineClamp={2}>
              {recipe.description}
            </Text>
          )}

          <HStack gap={4} fontSize="sm" color="gray.500">
            <HStack gap={1}>
              <Users size={14} />
              <Text>{recipe.servings} מנות</Text>
            </HStack>
            {recipe.prepTime && (
              <HStack gap={1}>
                <Clock size={14} />
                <Text>{recipe.prepTime} דק'</Text>
              </HStack>
            )}
          </HStack>

          <HStack gap={2} flexWrap="wrap">
            {recipe.recipeIngredients.slice(0, 3).map((ing, idx) => (
              <Badge key={idx} colorPalette="orange" variant="subtle" fontSize="xs">
                {ing.ingredient.name}
              </Badge>
            ))}
            {recipe.recipeIngredients.length > 3 && (
              <Badge colorPalette="gray" variant="subtle" fontSize="xs">
                +{recipe.recipeIngredients.length - 3}
              </Badge>
            )}
          </HStack>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
