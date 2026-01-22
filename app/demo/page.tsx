'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Input,
  Textarea,
  Card,
  Badge,
  SimpleGrid,
  Stack,
  HStack,
  Field,
  IconButton,
  Circle,
  Center,
} from '@chakra-ui/react';
import { 
  Search, Heart, Trash2, Plus, 
  Star, Clock, Users, ChefHat, 
  Sparkles, Check, ArrowRight 
} from 'lucide-react';

export default function PremiumComponentsDemo() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Box minH="100vh" bg="orange.50/30" dir="rtl" pb={20}>
      
      {/* --- HERO SECTION --- */}
      <Box bg="white" borderBottom="1px" borderColor="orange.100" py={16} boxShadow="sm" mb={12}>
        <Container maxW="4xl" mx="auto" textAlign="center">
          <Stack gap={6} align="center">
            <Circle bg="orange.500" p={4} boxShadow="0 10px 25px -5px rgba(249, 115, 22, 0.4)">
              <ChefHat size={40} color="white" />
            </Circle>
            <Stack gap={2}>
              <Heading size="3xl" fontWeight="extrabold" letterSpacing="tight">
                ספריית <Text as="span" color="orange.500">העיצוב</Text> שלי
              </Heading>
              <Text color="gray.500" fontSize="lg" maxW="xl">
                ריכוז כל האלמנטים המעוצבים עבור אפליקציית המתכונים. 
                מכאן אפשר להעתיק את הסטייל המדויק לכל העמודים.
              </Text>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxW="5xl" mx="auto" px={6}>
        <Stack gap={16}>

          {/* --- BUTTONS SECTION --- */}
          <Box>
            <SectionTitle icon={Sparkles} title="כפתורים ואינטראקציה" />
            <Card.Root variant="elevated" borderRadius="3xl" boxShadow="sm" border="none">
              <Card.Body p={10}>
                <Stack gap={10}>
                  <Box>
                    <Label text="וריאציות צבע" />
                    <HStack gap={4} flexWrap="wrap">
                      <Button bg="orange.500" color="white" size="lg" borderRadius="2xl" px={8} _hover={{ bg: 'orange.600', transform: 'translateY(-2px)' }} boxShadow="lg">
                        כפתור ראשי
                      </Button>
                      <Button variant="outline" colorPalette="orange" size="lg" borderRadius="2xl" px={8}>
                        כפתור משני
                      </Button>
                      <Button bg="gray.900" color="white" size="lg" borderRadius="2xl" px={8} _hover={{ bg: 'black' }}>
                        כפתור כהה
                      </Button>
                      <Button bg="red.500" color="white" size="lg" borderRadius="2xl" px={8} _hover={{ bg: 'red.600' }}>
                        מחיקה
                      </Button>
                    </HStack>
                  </Box>

                  <Box>
                    <Label text="כפתורים עם אייקונים" />
                    <HStack gap={4}>
                      <Button bg="orange.500" color="white" borderRadius="xl" px={6}>
                        <Plus size={18} style={{marginLeft: '8px'}} /> מתכון חדש
                      </Button>
                      <IconButton variant="subtle" colorPalette="red" borderRadius="xl" size="lg">
                        <Trash2 size={20} />
                      </IconButton>
                      <IconButton variant="outline" colorPalette="orange" borderRadius="full" size="lg">
                        <Heart size={20} />
                      </IconButton>
                    </HStack>
                  </Box>
                </Stack>
              </Card.Body>
            </Card.Root>
          </Box>

          {/* --- INPUTS SECTION --- */}
          <Box>
            <SectionTitle icon={Search} title="שדות קלט וטפסים" />
            <Card.Root variant="elevated" borderRadius="3xl" boxShadow="sm">
              <Card.Body p={10}>
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={10}>
                  <Field.Root>
                    <Field.Label fontWeight="bold" mb={2}>שם המתכון</Field.Label>
                    <Input 
                      placeholder="לדוגמה: לחם מחמצת" 
                      size="lg" 
                      h="56px"
                      borderRadius="xl" 
                      bg="gray.50"
                      borderWidth="2px"
                      _focus={{ borderColor: 'orange.400', bg: 'white' }}
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label fontWeight="bold" mb={2}>חיפוש במאגר</Field.Label>
                    <Box position="relative">
                      <Input 
                        placeholder="חפשי מרכיב..." 
                        h="56px"
                        borderRadius="xl" 
                        pr={12}
                        bg="orange.50/50"
                        border="none"
                      />
                      <Box position="absolute" right={4} top="50%" transform="translateY(-50%)" color="orange.500">
                        <Search size={20} />
                      </Box>
                    </Box>
                  </Field.Root>
                </SimpleGrid>
              </Card.Body>
            </Card.Root>
          </Box>

          {/* --- CARDS SECTION --- */}
          <Box>
            <SectionTitle icon={ChefHat} title="כרטיסים ותצוגה" />
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
              
              {/* Recipe Card Style */}
              <Card.Root overflow="hidden" borderRadius="3xl" boxShadow="xl" border="none" transition="all 0.3s" _hover={{ transform: 'translateY(-8px)' }}>
                <Box h="200px" bgGradient="to-br" gradientFrom="orange.400" gradientTo="yellow.400" position="relative">
                  <Center h="full">
                    <ChefHat size={60} color="white" opacity={0.3} />
                  </Center>
                  <Badge position="absolute" top={4} right={4} bg="white" color="orange.600" borderRadius="lg" px={3} py={1} boxShadow="sm">קל להכנה</Badge>
                </Box>
                <Card.Body p={6}>
                  <Stack gap={4}>
                    <HStack justify="space-between">
                      <Heading size="md" fontWeight="bold">עוגת תפוזים נימוחה</Heading>
                      <HStack gap={1} bg="yellow.50" px={2} py={1} borderRadius="md">
                        <Star size={14} fill="#EAB308" color="#EAB308" />
                        <Text fontWeight="bold" fontSize="xs" color="yellow.700">4.9</Text>
                      </HStack>
                    </HStack>
                    <Text fontSize="sm" color="gray.500">עוגה בטעם של פעם, ריחנית ומושלמת לצד הקפה של הבוקר...</Text>
                    <HStack gap={4} pt={2}>
                      <HStack gap={1} color="gray.400"><Clock size={14} /><Text fontSize="xs">45 דק'</Text></HStack>
                      <HStack gap={1} color="gray.400"><Users size={14} /><Text fontSize="xs">12 מנות</Text></HStack>
                    </HStack>
                  </Stack>
                </Card.Body>
              </Card.Root>

              {/* Status Card Style */}
              <Stack gap={6}>
                <Card.Root borderRadius="2xl" bg="blue.500" color="white" p={6} border="none">
                  <HStack gap={4}>
                    <Circle bg="white/20" p={3}>
                      <Sparkles size={24} />
                    </Circle>
                    <Stack gap={0}>
                      <Text fontWeight="bold">עדכון חדש זמין!</Text>
                      <Text fontSize="sm" opacity={0.9}>הוספנו אפשרות לסרוק מתכונים מכתב יד.</Text>
                    </Stack>
                  </HStack>
                </Card.Root>

                <Card.Root borderRadius="2xl" border="2px dashed" borderColor="orange.200" bg="orange.50/50">
                  <Card.Body>
                    <Stack align="center" textAlign="center" py={4} gap={3}>
                      <Plus size={32} color="#f97316" />
                      <Text fontWeight="bold" color="orange.600">הוסיפי תוכן חדש</Text>
                    </Stack>
                  </Card.Body>
                </Card.Root>
              </Stack>

            </SimpleGrid>
          </Box>

        </Stack>
      </Container>
    </Box>
  );
}

// קומפוננטות עזר קטנות לעיצוב
function SectionTitle({ icon: Icon, title }: any) {
  return (
    <HStack gap={3} mb={6} align="center">
      <Circle bg="orange.100" p={2} color="orange.600">
        <Icon size={20} />
      </Circle>
      <Heading size="lg" fontWeight="bold">{title}</Heading>
      <Box h="1px" bg="gray.200" flex={1} ml={4} />
    </HStack>
  );
}

function Label({ text }: { text: string }) {
  return (
    <Text fontSize="xs" fontWeight="black" color="gray.400" textTransform="uppercase" letterSpacing="widest" mb={4}>
      {text}
    </Text>
  );
}