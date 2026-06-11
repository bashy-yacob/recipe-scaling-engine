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
} from '@chakra-ui/react';
import { 
  Search, Heart, Trash2, Plus, 
  Star, Clock, Users, ChefHat, 
  Sparkles, Check 
} from 'lucide-react';

export function DemoPage() {

  return (
    <Box minH="100vh" bg="bg.page" dir="rtl" pb={20}>
      
      {/* --- HERO SECTION --- */}
      <Box bg="bg.surface" borderBottom="1px solid" borderColor="border.muted" py={12} mb={10}>
        <Container maxW="4xl" mx="auto" textAlign="center">
          <Stack gap={5} align="center">
            <Box bg="bg.brand.subtle" p={3} borderRadius="lg">
              <ChefHat size={32} color="var(--chakra-colors-brand-500)" />
            </Box>
            <Stack gap={1.5}>
              <Heading size="2xl" fontWeight="bold" color="fg.heading">
                ספריית <Text as="span" color="fg.brand">העיצוב</Text> שלי
              </Heading>
              <Text color="fg.muted" fontSize="md" maxW="xl">
                ריכוז כל האלמנטים המעוצבים עבור אפליקציית המתכונים. 
                מכאן אפשר להעתיק את הסטייל המדויק לכל העמודים.
              </Text>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxW="4xl" mx="auto" px={4}>
        <Stack gap={12}>

          {/* --- BUTTONS SECTION --- */}
          <Box>
            <SectionTitle icon={Sparkles} title="כפתורים ואינטראקציה" />
            <Card.Root variant="outline" borderColor="border.default" bg="bg.surface" borderRadius="xl">
              <Card.Body p={8}>
                <Stack gap={8}>
                  <Box>
                    <Label text="וריאציות צבע" />
                    <HStack gap={3} flexWrap="wrap">
                      <Button bg="btn.primary.bg" color="btn.primary.fg" borderRadius="lg" px={6} _hover={{ bg: 'btn.primary.hover' }}>
                        כפתור ראשי
                      </Button>
                      <Button variant="outline" borderColor="border.default" color="fg.default" borderRadius="lg" px={6}>
                        כפתור משני
                      </Button>
                      <Button bg="fg.heading" color="bg.page" borderRadius="lg" px={6}>
                        כפתור כהה
                      </Button>
                      <Button bg="red.500" color="white" borderRadius="lg" px={6} _hover={{ bg: 'red.600' }}>
                        מחיקה
                      </Button>
                    </HStack>
                  </Box>

                  <Box>
                    <Label text="כפתורים עם אייקונים" />
                    <HStack gap={3}>
                      <Button bg="btn.primary.bg" color="btn.primary.fg" borderRadius="lg" px={5}>
                        <Plus size={16} />
                        <Text ms={1}>מתכון חדש</Text>
                      </Button>
                      <IconButton variant="ghost" color="red.500" borderRadius="lg" size="lg" aria-label="מחק">
                        <Trash2 size={18} />
                      </IconButton>
                      <IconButton variant="outline" borderColor="border.default" color="fg.brand" borderRadius="full" size="lg" aria-label="לייק">
                        <Heart size={18} />
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
            <Card.Root variant="outline" borderColor="border.default" bg="bg.surface" borderRadius="xl">
              <Card.Body p={8}>
                <Stack gap={6}>
                  <Box>
                    <Label text="שדה טקסט רגיל" />
                    <Input
                      placeholder="הזן טקסט כאן..."
                      borderRadius="lg"
                      borderColor="border.default"
                    />
                  </Box>
                  <Box>
                    <Label text="שדה חיפוש" />
                    <Box position="relative">
                      <Box position="absolute" right={3} top="50%" transform="translateY(-50%)" zIndex={2}>
                        <Search size={18} color="var(--chakra-colors-fg-muted)" />
                      </Box>
                      <Input
                        placeholder="חיפוש מתכונים..."
                        borderRadius="lg"
                        borderColor="border.default"
                        pr={10}
                      />
                    </Box>
                  </Box>
                  <Box>
                    <Label text="Textarea" />
                    <Textarea
                      placeholder="כתוב את תיאור המתכון..."
                      rows={4}
                      borderRadius="lg"
                      borderColor="border.default"
                    />
                  </Box>
                </Stack>
              </Card.Body>
            </Card.Root>
          </Box>

          {/* --- CARDS SECTION --- */}
          <Box>
            <SectionTitle icon={Star} title="כרטיסי מתכון" />
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
              <Card.Root variant="outline" borderColor="border.default" bg="bg.surface" borderRadius="xl" _hover={{ transform: 'translateY(-2px)', shadow: 'md' }} transition="all 0.2s">
                <Card.Body p={5}>
                  <Stack gap={3}>
                    <HStack justify="space-between">
                      <Heading size="sm" color="fg.heading">עוגת שוקולד בלגית</Heading>
                      <IconButton variant="ghost" color="red.400" size="sm" aria-label="לייק">
                        <Heart size={16} />
                      </IconButton>
                    </HStack>
                    <Text color="fg.muted" fontSize="sm" lineClamp={2}>
                      עוגה עשירה ונימוחה עם שוקולד בלגי איכותי
                    </Text>
                    <HStack gap={4} fontSize="xs" color="fg.muted">
                      <HStack gap={1}>
                        <Users size={13} />
                        <Text>8 מנות</Text>
                      </HStack>
                      <HStack gap={1}>
                        <Clock size={13} />
                        <Text>45 דק'</Text>
                      </HStack>
                    </HStack>
                    <HStack gap={1.5} flexWrap="wrap">
                      <Badge bg="bg.brand.subtle" color="fg.brand" fontSize="xs" borderRadius="md">שוקולד</Badge>
                      <Badge bg="bg.brand.subtle" color="fg.brand" fontSize="xs" borderRadius="md">קמח</Badge>
                      <Badge bg="bg.brand.subtle" color="fg.brand" fontSize="xs" borderRadius="md">סוכר</Badge>
                    </HStack>
                  </Stack>
                </Card.Body>
              </Card.Root>

              <Card.Root variant="outline" borderColor="border.brand" bg="bg.surface" borderRadius="xl" _hover={{ shadow: 'md' }} transition="all 0.2s">
                <Card.Body p={5}>
                  <Stack gap={3}>
                    <HStack justify="space-between">
                      <Heading size="sm" color="fg.heading">חלה ביתית</Heading>
                      <Badge colorPalette="green" variant="solid" fontSize="xs">ציבורי</Badge>
                    </HStack>
                    <Text color="fg.muted" fontSize="sm" lineClamp={2}>
                      חלה רכה וזהובה לשבת
                    </Text>
                    <HStack gap={4} fontSize="xs" color="fg.muted">
                      <HStack gap={1}>
                        <Users size={13} />
                        <Text>2 חלות</Text>
                      </HStack>
                      <HStack gap={1}>
                        <Clock size={13} />
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
            <Card.Root variant="outline" borderColor="border.default" bg="bg.surface" borderRadius="xl">
              <Card.Body p={8}>
                <Stack gap={5}>
                  <Box>
                    <Label text="קטגוריות" />
                    <HStack gap={2} flexWrap="wrap">
                      <Badge bg="bg.brand.subtle" color="fg.brand" fontSize="sm" px={3} py={1} borderRadius="md">קינוח</Badge>
                      <Badge colorPalette="green" variant="subtle" fontSize="sm" px={3} py={1} borderRadius="md">בריא</Badge>
                      <Badge colorPalette="purple" variant="subtle" fontSize="sm" px={3} py={1} borderRadius="md">טבעוני</Badge>
                      <Badge colorPalette="blue" variant="subtle" fontSize="sm" px={3} py={1} borderRadius="md">מהיר</Badge>
                    </HStack>
                  </Box>
                  <Box>
                    <Label text="סטטוסים" />
                    <HStack gap={2}>
                      <Badge colorPalette="green" variant="solid" borderRadius="md">פורסם</Badge>
                      <Badge colorPalette="yellow" variant="solid" borderRadius="md">טיוטה</Badge>
                      <Badge colorPalette="red" variant="solid" borderRadius="md">נמחק</Badge>
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
  icon: React.ComponentType<{ size: number; color?: string }>;
  title: string;
}

function SectionTitle({ icon: Icon, title }: SectionTitleProps) {
  return (
    <HStack gap={2} mb={5}>
      <Box bg="bg.brand.subtle" p={1.5} borderRadius="md">
        <Icon size={18} color="var(--chakra-colors-brand-500)" />
      </Box>
      <Heading size="md" fontWeight="bold" color="fg.heading">{title}</Heading>
    </HStack>
  );
}

function Label({ text }: { text: string }) {
  return <Text fontWeight="medium" fontSize="sm" color="fg.muted" mb={2}>{text}</Text>;
}
