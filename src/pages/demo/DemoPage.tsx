// src/pages/demo/DemoPage.tsx

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
  IconButton,
  Circle,
} from '@chakra-ui/react';
import { 
  Search, Heart, Trash2, Plus, 
  Star, Clock, Users, ChefHat, 
  Sparkles, Check 
} from 'lucide-react';

export function DemoPage() {

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
                      <IconButton variant="subtle" colorPalette="red" borderRadius="xl" size="lg" aria-label="מחק">
                        <Trash2 size={20} />
                      </IconButton>
                      <IconButton variant="outline" colorPalette="orange" borderRadius="full" size="lg" aria-label="לייק">
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
            <SectionTitle icon={Search} title="שדות קלט" />
            <Card.Root variant="elevated" borderRadius="3xl" boxShadow="sm" border="none">
              <Card.Body p={10}>
                <Stack gap={8}>
                  <Box>
                    <Label text="שדה טקסט רגיל" />
                    <Input
                      placeholder="הזן טקסט כאן..."
                      size="lg"
                      borderRadius="xl"
                      bg="gray.50"
                      border="0"
                      _focus={{ bg: 'white', ring: 2, ringColor: 'orange.500' }}
                    />
                  </Box>
                  <Box>
                    <Label text="שדה חיפוש" />
                    <Box position="relative">
                      <Box position="absolute" right={4} top="50%" transform="translateY(-50%)" zIndex={2}>
                        <Search size={20} color="#a0aec0" />
                      </Box>
                      <Input
                        placeholder="חיפוש מתכונים..."
                        size="lg"
                        borderRadius="xl"
                        pr={12}
                        bg="gray.50"
                        border="0"
                        _focus={{ bg: 'white', ring: 2, ringColor: 'orange.500' }}
                      />
                    </Box>
                  </Box>
                  <Box>
                    <Label text="Textarea" />
                    <Textarea
                      placeholder="כתוב את תיאור המתכון..."
                      rows={4}
                      borderRadius="xl"
                      bg="gray.50"
                      border="0"
                      _focus={{ bg: 'white', ring: 2, ringColor: 'orange.500' }}
                    />
                  </Box>
                </Stack>
              </Card.Body>
            </Card.Root>
          </Box>

          {/* --- CARDS SECTION --- */}
          <Box>
            <SectionTitle icon={Star} title="כרטיסי מתכון" />
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
              {/* Recipe Card Example */}
              <Card.Root variant="elevated" borderRadius="2xl" overflow="hidden" _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }} transition="all 0.2s">
                <Card.Body p={6}>
                  <Stack gap={4}>
                    <HStack justify="space-between">
                      <Heading size="md">עוגת שוקולד בלגית</Heading>
                      <IconButton variant="ghost" colorPalette="red" size="sm" aria-label="לייק">
                        <Heart size={18} />
                      </IconButton>
                    </HStack>
                    <Text color="gray.500" fontSize="sm" lineClamp={2}>
                      עוגה עשירה ונימוחה עם שוקולד בלגי איכותי
                    </Text>
                    <HStack gap={4} fontSize="sm" color="gray.500">
                      <HStack gap={1}>
                        <Users size={14} />
                        <Text>8 מנות</Text>
                      </HStack>
                      <HStack gap={1}>
                        <Clock size={14} />
                        <Text>45 דק'</Text>
                      </HStack>
                    </HStack>
                    <HStack gap={2} flexWrap="wrap">
                      <Badge colorPalette="orange" variant="subtle">שוקולד</Badge>
                      <Badge colorPalette="orange" variant="subtle">קמח</Badge>
                      <Badge colorPalette="orange" variant="subtle">סוכר</Badge>
                    </HStack>
                  </Stack>
                </Card.Body>
              </Card.Root>

              {/* Another Card */}
              <Card.Root variant="outline" borderRadius="2xl" overflow="hidden" borderColor="orange.200" _hover={{ borderColor: 'orange.400', boxShadow: 'md' }} transition="all 0.2s">
                <Card.Body p={6}>
                  <Stack gap={4}>
                    <HStack justify="space-between">
                      <Heading size="md">חלה ביתית</Heading>
                      <Badge colorPalette="green" variant="solid">ציבורי</Badge>
                    </HStack>
                    <Text color="gray.500" fontSize="sm" lineClamp={2}>
                      חלה רכה וזהובה לשבת
                    </Text>
                    <HStack gap={4} fontSize="sm" color="gray.500">
                      <HStack gap={1}>
                        <Users size={14} />
                        <Text>2 חלות</Text>
                      </HStack>
                      <HStack gap={1}>
                        <Clock size={14} />
                        <Text>3 שעות</Text>
                      </HStack>
                    </HStack>
                  </Stack>
                </Card.Body>
              </Card.Root>
            </SimpleGrid>
          </Box>

          {/* --- BADGES SECTION --- */}
          <Box>
            <SectionTitle icon={Check} title="תגיות ובדג'ים" />
            <Card.Root variant="elevated" borderRadius="3xl" boxShadow="sm" border="none">
              <Card.Body p={10}>
                <Stack gap={6}>
                  <Box>
                    <Label text="קטגוריות" />
                    <HStack gap={2} flexWrap="wrap">
                      <Badge colorPalette="orange" variant="subtle" fontSize="sm" px={3} py={1}>קינוח</Badge>
                      <Badge colorPalette="green" variant="subtle" fontSize="sm" px={3} py={1}>בריא</Badge>
                      <Badge colorPalette="purple" variant="subtle" fontSize="sm" px={3} py={1}>טבעוני</Badge>
                      <Badge colorPalette="blue" variant="subtle" fontSize="sm" px={3} py={1}>מהיר</Badge>
                    </HStack>
                  </Box>
                  <Box>
                    <Label text="סטטוסים" />
                    <HStack gap={2}>
                      <Badge colorPalette="green" variant="solid">פורסם</Badge>
                      <Badge colorPalette="yellow" variant="solid">טיוטה</Badge>
                      <Badge colorPalette="red" variant="solid">נמחק</Badge>
                    </HStack>
                  </Box>
                </Stack>
              </Card.Body>
            </Card.Root>
          </Box>

        </Stack>
      </Container>
    </Box>
  );
}

// Helper Components
interface SectionTitleProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  title: string;
}

function SectionTitle({ icon: Icon, title }: SectionTitleProps) {
  return (
    <HStack gap={3} mb={6}>
      <Circle bg="orange.100" p={2}>
        <Icon size={20} color="#ea580c" />
      </Circle>
      <Heading size="lg" fontWeight="bold">{title}</Heading>
    </HStack>
  );
}

function Label({ text }: { text: string }) {
  return <Text fontWeight="medium" fontSize="sm" color="gray.600" mb={3}>{text}</Text>;
}
