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
  Tabs,
  Select,
  createListCollection,
  Skeleton,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, ChefHat, Heart, Clock, Users, Globe, Lock, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { toaster } from '@/components/ui/toaster';
import { getRecipes, toggleRecipeLike, toggleRecipePublic } from '@/lib/api/recipes';
import { ROUTES, getRecipeDetailsPath } from '@/router';
import type { RecipeListItem } from '@/types/recipe';

const MotionBox = motion.create(Box);

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' as const },
  }),
};

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
      <Box bg="bg.page" minH="100vh" dir="rtl">
        <Box bg="bg.surface" borderBottom="1px solid" borderColor="border.muted">
          <Container maxW="5xl" mx="auto" py={8} px={6}>
            <Skeleton h="36px" w="200px" borderRadius="lg" />
          </Container>
        </Box>
        <Container maxW="5xl" mx="auto" py={6} px={6}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={5}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} h="180px" borderRadius="xl" />
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="bg.page" dir="rtl">
      {/* Header */}
      <Box bg="bg.surface" borderBottom="1px solid" borderColor="border.muted">
        <Container maxW="5xl" mx="auto" py={8} px={6}>
          <HStack justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <Stack gap={0.5}>
              <Heading size="xl" fontWeight="bold" color="fg.heading">
                המתכונים שלי
              </Heading>
              <Text color="fg.muted" fontSize="sm">
                {recipes.length} מתכונים בספרייה
              </Text>
            </Stack>
            
            <Button
              asChild
              bg="btn.primary.bg"
              color="btn.primary.fg"
              size="md"
              borderRadius="lg"
              px={5}
              _hover={{ bg: 'btn.primary.hover' }}
            >
              <Link to={ROUTES.RECIPE_NEW}>
                <Plus size={18} />
                <Text ms={1.5}>מתכון חדש</Text>
              </Link>
            </Button>
          </HStack>
        </Container>
      </Box>

      {/* Search & Filters */}
      <Container maxW="5xl" mx="auto" py={5} px={6}>
        <Stack gap={3}>
          {/* Search Bar */}
          <HStack gap={3}>
            <Box position="relative" flex={1}>
              <Box position="absolute" right={3} top="50%" transform="translateY(-50%)" zIndex={2}>
                <Search size={16} color="currentColor" />
              </Box>
              <Input
                placeholder="חיפוש מתכונים..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                pr={10}
                size="md"
                borderRadius="lg"
                bg="bg.surface"
                borderColor="border.default"
                _focus={{ borderColor: 'brand.500' }}
              />
            </Box>
            <Button
              variant="outline"
              size="md"
              borderRadius="lg"
              borderColor="border.default"
              color="fg.default"
              _hover={{ bg: 'bg.muted' }}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              <Text ms={1.5}>פילטרים</Text>
            </Button>
          </HStack>

          {/* Filters Panel */}
          {showFilters && (
            <Card.Root variant="outline" borderRadius="lg" borderColor="border.default" bg="bg.surface">
              <Card.Body p={4}>
                <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={2} color="fg.default">מיון</Text>
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
                    <Text fontSize="sm" fontWeight="medium" mb={2} color="fg.default">רמת קושי</Text>
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
                    <Text fontSize="sm" fontWeight="medium" mb={2} color="fg.default">קטגוריה</Text>
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
          <Center py={16}>
            <Stack align="center" gap={3}>
              <ChefHat size={48} color="currentColor" />
              <Text color="fg.muted" fontSize="md">
                {searchQuery ? 'לא נמצאו מתכונים התואמים לחיפוש' : 'אין מתכונים עדיין'}
              </Text>
              <Button asChild bg="btn.primary.bg" color="btn.primary.fg" borderRadius="lg" _hover={{ bg: 'btn.primary.hover' }}>
                <Link to={ROUTES.RECIPE_NEW}>הוסף מתכון ראשון</Link>
              </Button>
            </Stack>
          </Center>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={5}>
            {filteredRecipes.map((recipe, index) => (
              <MotionBox
                key={recipe.id}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                custom={index}
              >
                <RecipeCard
                  recipe={recipe}
                  onTogglePublish={handleTogglePublish}
                  onToggleLike={handleToggleLike}
                  onClick={() => navigate(getRecipeDetailsPath(recipe.id))}
                />
              </MotionBox>
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
      variant="outline"
      borderRadius="xl"
      borderColor="border.default"
      bg="bg.surface"
      overflow="hidden"
      cursor="pointer"
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-2px)', shadow: 'md', borderColor: 'border.brand' }}
      onClick={onClick}
    >
      <Card.Body p={5}>
        <Stack gap={3}>
          <HStack justify="space-between">
            <Heading size="md" lineClamp={1} color="fg.heading">{recipe.title}</Heading>
            <HStack gap={1}>
              <Button
                size="xs"
                variant="ghost"
                onClick={(e) => onToggleLike(e, recipe.id)}
                color={recipe.isLiked ? 'red.500' : 'fg.subtle'}
              >
                <Heart size={14} fill={recipe.isLiked ? 'currentColor' : 'none'} />
                <Text>{recipe.likeCount}</Text>
              </Button>
              <Button
                size="xs"
                variant="ghost"
                onClick={(e) => onTogglePublish(e, recipe.id, recipe.isPublic || false)}
                color={recipe.isPublic ? 'green.500' : 'fg.subtle'}
              >
                {recipe.isPublic ? <Globe size={14} /> : <Lock size={14} />}
              </Button>
            </HStack>
          </HStack>

          {recipe.description && (
            <Text color="fg.muted" fontSize="sm" lineClamp={2}>
              {recipe.description}
            </Text>
          )}

          <HStack gap={4} fontSize="sm" color="fg.muted">
            <HStack gap={1}>
              <Users size={13} />
              <Text>{recipe.servings} מנות</Text>
            </HStack>
            {recipe.prepTime && (
              <HStack gap={1}>
                <Clock size={13} />
                <Text>{recipe.prepTime} דק'</Text>
              </HStack>
            )}
          </HStack>

          <HStack gap={2} flexWrap="wrap">
            {recipe.recipeIngredients.slice(0, 3).map((ing, idx) => (
              <Badge key={idx} variant="subtle" fontSize="xs" bg="bg.brand.subtle" color="fg.brand" borderRadius="md">
                {ing.ingredient.name}
              </Badge>
            ))}
            {recipe.recipeIngredients.length > 3 && (
              <Badge variant="subtle" fontSize="xs" bg="bg.muted" color="fg.muted" borderRadius="md">
                +{recipe.recipeIngredients.length - 3}
              </Badge>
            )}
          </HStack>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
