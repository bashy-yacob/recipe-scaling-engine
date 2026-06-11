// src/pages/recipes/RecipeEditPage.tsx

import { useState, useEffect } from 'react';
import {
  Box, Container, Heading, Text, Button, Input, Textarea, Card,
  HStack, Stack, Badge, IconButton, SimpleGrid, Skeleton,
} from '@chakra-ui/react';
import { toaster } from '@/components/ui/toaster';
import { ImageUploader } from '@/components/shared/ImageUploader';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Save, Plus, Trash2, Star } from 'lucide-react';
import { getRecipeById, updateRecipe } from '@/lib/api/recipes';
import { ROUTES, getRecipeDetailsPath } from '@/router';

interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
  scalingRule?: string;
}

interface Instruction {
  id: string;
  description: string;
}

interface RecipeImage {
  id: string;
  url: string;
  caption: string;
  stepNumber?: number;
  isMain: boolean;
}

export function RecipeEditPage() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const recipeId = params.id!;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [servings, setServings] = useState('4');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [images, setImages] = useState<RecipeImage[]>([]);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const result = await getRecipeById(recipeId);
        if (result.success && result.data) {
          const recipe = result.data;
          setTitle(recipe.title);
          setDescription(recipe.description || '');
          setServings(recipe.servings.toString());
          setPrepTime(recipe.prepTime?.toString() || '');
          setCookTime(recipe.cookTime?.toString() || '');
          
          setIngredients(
            recipe.recipeIngredients.map((ing, idx) => ({
              id: idx.toString(),
              name: ing.ingredient.name,
              amount: ing.amount?.toString() || '',
              unit: ing.unit,
            }))
          );
          
          setInstructions(
            recipe.instructions.map((inst, idx) => ({
              id: idx.toString(),
              description: inst.description || inst.content || '',
            }))
          );
          
          if (recipe.images) {
            setImages(
              recipe.images.map((img) => ({
                id: img.id,
                url: img.url,
                caption: img.caption || '',
                isMain: img.isMain,
              }))
            );
          }
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
        toaster.create({ title: 'שגיאה בטעינת המתכון', type: 'error' });
        navigate(ROUTES.RECIPES);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId, navigate]);

  const addIngredient = () => {
    setIngredients(prev => [...prev, { id: Date.now().toString(), name: '', amount: '', unit: 'גרם' }]);
  };

  const addInstruction = () => {
    setInstructions(prev => [...prev, { id: Date.now().toString(), description: '' }]);
  };

  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const removeInstruction = (id: string) => {
    if (instructions.length > 1) setInstructions(instructions.filter(inst => inst.id !== id));
  };

  const addImage = () => {
    setImages(prev => [...prev, {
      id: Date.now().toString(),
      url: '',
      caption: '',
      isMain: prev.length === 0,
    }]);
  };

  const removeImage = (id: string) => {
    const imageToRemove = images.find(img => img.id === id);
    const newImages = images.filter(img => img.id !== id);
    
    if (imageToRemove?.isMain && newImages.length > 0) {
      newImages[0].isMain = true;
    }
    
    setImages(newImages);
  };

  const setMainImage = (id: string) => {
    setImages(prev => prev.map(img => ({
      ...img,
      isMain: img.id === id,
    })));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toaster.create({ title: 'שם המתכון חובה', type: 'error' });
      return;
    }

    const validIngredients = ingredients.filter(ing => ing.name.trim());
    if (validIngredients.length === 0) {
      toaster.create({ title: 'צריך לפחות מרכיב אחד', type: 'error' });
      return;
    }
    
    const isComplete = validIngredients.every(ing => ing.amount.trim() !== '');

    setSaving(true);
    try {
      const result = await updateRecipe(recipeId, {
        title,
        description,
        servings: parseInt(servings) || 1,
        prepTime: prepTime ? parseInt(prepTime) : 0,
        cookTime: cookTime ? parseInt(cookTime) : 0,
        isComplete,
        ingredients: validIngredients.map(ing => ({
          name: ing.name,
          amount: ing.amount.trim() ? parseFloat(ing.amount) : null,
          unit: ing.unit || 'גרם',
          scalingRule: (ing.scalingRule as 'linear' | 'logarithmic' | 'sqrt' | 'fixed') || 'linear',
        })),
        instructions: instructions
          .filter(inst => inst.description.trim())
          .map((inst, idx) => ({
            content: inst.description,
            order: idx,
          })),
        images: images
          .filter(img => img.url.trim())
          .map((img, idx) => ({
            url: img.url,
            caption: img.caption,
            order: idx,
            isMain: img.isMain,
          })),
      });

      if (!result.success) throw new Error(result.error);

      toaster.create({ title: 'המתכון עודכן בהצלחה!', type: 'success' });
      navigate(getRecipeDetailsPath(recipeId));
    } catch (error) {
      console.error('Save error:', error);
      toaster.create({ title: 'שגיאה בשמירה', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box bg="bg.page" minH="100vh" dir="rtl">
        <Box bg="bg.surface" borderBottom="1px solid" borderColor="border.muted">
          <Container maxW="4xl" mx="auto" py={5} px={4}>
            <Skeleton h="32px" w="250px" borderRadius="lg" />
          </Container>
        </Box>
        <Container maxW="4xl" mx="auto" py={8} px={4}>
          <Stack gap={6}>
            <Skeleton h="200px" borderRadius="xl" />
            <Skeleton h="200px" borderRadius="xl" />
          </Stack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="bg.page" dir="rtl">
      {/* Header */}
      <Box bg="bg.surface" borderBottom="1px solid" borderColor="border.muted">
        <Container maxW="4xl" mx="auto" py={5} px={4}>
          <HStack justify="space-between" align="center">
            <HStack gap={3}>
              <Button asChild variant="ghost" size="sm" color="fg.muted" _hover={{ color: 'fg.default' }}>
                <Link to={getRecipeDetailsPath(recipeId)}>
                  <ArrowRight size={18} />
                  <Text ms={1}>חזרה</Text>
                </Link>
              </Button>
              <Heading size="lg" fontWeight="bold" color="fg.heading">עריכת מתכון</Heading>
            </HStack>
            <Button
              bg="btn.primary.bg"
              color="btn.primary.fg"
              _hover={{ bg: 'btn.primary.hover' }}
              borderRadius="lg"
              size="sm"
              onClick={handleSave}
              loading={saving}
              loadingText="שומר..."
            >
              <Save size={16} />
              <Text ms={1}>שמירה</Text>
            </Button>
          </HStack>
        </Container>
      </Box>

      <Container maxW="4xl" mx="auto" py={8} px={4}>
        <Stack gap={6}>
          {/* Basic Info */}
          <Card.Root variant="outline" borderColor="border.default" bg="bg.surface" borderRadius="xl">
            <Card.Body p={6}>
              <Stack gap={5}>
                <Heading size="sm" color="fg.heading">פרטי המתכון</Heading>
                
                <Box>
                  <Text mb={1.5} fontWeight="medium" fontSize="sm" color="fg.default">שם המתכון *</Text>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="לדוגמה: עוגת שוקולד בלגית"
                    borderRadius="lg"
                    borderColor="border.default"
                  />
                </Box>

                <Box>
                  <Text mb={1.5} fontWeight="medium" fontSize="sm" color="fg.default">תיאור</Text>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="תיאור קצר של המתכון..."
                    rows={3}
                    borderRadius="lg"
                    borderColor="border.default"
                  />
                </Box>

                <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                  <Box>
                    <Text mb={1.5} fontWeight="medium" fontSize="sm" color="fg.default">מנות</Text>
                    <Input
                      type="number"
                      value={servings}
                      onChange={(e) => setServings(e.target.value)}
                      min={1}
                      borderRadius="lg"
                      borderColor="border.default"
                    />
                  </Box>
                  <Box>
                    <Text mb={1.5} fontWeight="medium" fontSize="sm" color="fg.default">זמן הכנה (דקות)</Text>
                    <Input
                      type="number"
                      value={prepTime}
                      onChange={(e) => setPrepTime(e.target.value)}
                      placeholder="30"
                      borderRadius="lg"
                      borderColor="border.default"
                    />
                  </Box>
                  <Box>
                    <Text mb={1.5} fontWeight="medium" fontSize="sm" color="fg.default">זמן בישול (דקות)</Text>
                    <Input
                      type="number"
                      value={cookTime}
                      onChange={(e) => setCookTime(e.target.value)}
                      placeholder="45"
                      borderRadius="lg"
                      borderColor="border.default"
                    />
                  </Box>
                </SimpleGrid>
              </Stack>
            </Card.Body>
          </Card.Root>

          {/* Ingredients */}
          <Card.Root variant="outline" borderColor="border.default" bg="bg.surface" borderRadius="xl">
            <Card.Body p={6}>
              <Stack gap={4}>
                <HStack justify="space-between">
                  <Heading size="sm" color="fg.heading">מרכיבים</Heading>
                  <Button size="sm" variant="outline" borderRadius="lg" borderColor="border.default" color="fg.default" onClick={addIngredient}>
                    <Plus size={14} />
                    <Text ms={1}>הוסף מרכיב</Text>
                  </Button>
                </HStack>

                {ingredients.map((ing, idx) => (
                  <HStack key={ing.id} gap={2}>
                    <Input
                      flex={2}
                      placeholder="שם המרכיב"
                      value={ing.name}
                      onChange={(e) => {
                        const newIngs = [...ingredients];
                        newIngs[idx].name = e.target.value;
                        setIngredients(newIngs);
                      }}
                    />
                    <Input
                      flex={1}
                      placeholder="כמות"
                      value={ing.amount}
                      onChange={(e) => {
                        const newIngs = [...ingredients];
                        newIngs[idx].amount = e.target.value;
                        setIngredients(newIngs);
                      }}
                    />
                    <Input
                      flex={1}
                      placeholder="יחידה"
                      value={ing.unit}
                      onChange={(e) => {
                        const newIngs = [...ingredients];
                        newIngs[idx].unit = e.target.value;
                        setIngredients(newIngs);
                      }}
                    />
                    <IconButton
                      variant="ghost"
                      colorPalette="red"
                      size="sm"
                      onClick={() => removeIngredient(ing.id)}
                      aria-label="הסר מרכיב"
                      disabled={ingredients.length === 1}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </HStack>
                ))}
              </Stack>
            </Card.Body>
          </Card.Root>

          {/* Instructions */}
          <Card.Root variant="outline" borderColor="border.default" bg="bg.surface" borderRadius="xl">
            <Card.Body p={6}>
              <Stack gap={4}>
                <HStack justify="space-between">
                  <Heading size="sm" color="fg.heading">הוראות הכנה</Heading>
                  <Button size="sm" variant="outline" borderRadius="lg" borderColor="border.default" color="fg.default" onClick={addInstruction}>
                    <Plus size={14} />
                    <Text ms={1}>הוסף שלב</Text>
                  </Button>
                </HStack>

                {instructions.map((inst, idx) => (
                  <HStack key={inst.id} gap={2} align="start">
                    <Badge
                      bg="brand.500"
                      color="white"
                      borderRadius="full"
                      w="28px"
                      h="28px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mt={2}
                      fontSize="xs"
                    >
                      {idx + 1}
                    </Badge>
                    <Textarea
                      flex={1}
                      placeholder={`שלב ${idx + 1}`}
                      value={inst.description}
                      onChange={(e) => {
                        const newInsts = [...instructions];
                        newInsts[idx].description = e.target.value;
                        setInstructions(newInsts);
                      }}
                      rows={2}
                    />
                    <IconButton
                      variant="ghost"
                      colorPalette="red"
                      size="sm"
                      onClick={() => removeInstruction(inst.id)}
                      aria-label="הסר שלב"
                      disabled={instructions.length === 1}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </HStack>
                ))}
              </Stack>
            </Card.Body>
          </Card.Root>

          {/* Images */}
          <Card.Root variant="outline" borderColor="border.default" bg="bg.surface" borderRadius="xl">
            <Card.Body p={6}>
              <Stack gap={4}>
                <HStack justify="space-between">
                  <Heading size="sm" color="fg.heading">תמונות</Heading>
                  <Button size="sm" variant="outline" borderRadius="lg" borderColor="border.default" color="fg.default" onClick={addImage}>
                    <Plus size={14} />
                    <Text ms={1}>הוסף תמונה</Text>
                  </Button>
                </HStack>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                  {images.map((img) => (
                    <Box key={img.id} position="relative">
                      <ImageUploader
                        value={img.url}
                        onChange={(url) => {
                          setImages(prev => prev.map(i =>
                            i.id === img.id ? { ...i, url } : i
                          ));
                        }}
                        onRemove={() => removeImage(img.id)}
                      />
                      {img.url && (
                        <HStack position="absolute" bottom={2} right={2} gap={1}>
                          <Button
                            size="xs"
                            variant={img.isMain ? 'solid' : 'outline'}
                            colorPalette="orange"
                            onClick={() => setMainImage(img.id)}
                          >
                            <Star size={12} fill={img.isMain ? 'currentColor' : 'none'} />
                            ראשית
                          </Button>
                        </HStack>
                      )}
                    </Box>
                  ))}
                </SimpleGrid>
              </Stack>
            </Card.Body>
          </Card.Root>
        </Stack>
      </Container>
    </Box>
  );
}
