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
} from '@chakra-ui/react';
import Link from 'next/link';
import { Plus, Search, ChefHat, Sparkles, Heart, Tag, BookOpen, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

export default function RecipesPage() {
  const recipes = [];

  return (
    <Box minH="100vh" bg="gray.50" dir="rtl" w="100%">
      {/* Header - חלק עליון */}
      <Box bg="white" borderBottom="1px" borderColor="gray.200" boxShadow="sm" w="100%">
        {/* הוספתי maxW ו-mx="auto" למרכוז מלא */}
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
                <StatItem icon={BookOpen} label="מתכונים" count={0} color="blue" />
                <StatItem icon={Heart} label="מועדפים" count={0} color="red" />
                <StatItem icon={Tag} label="תגיות" count={0} color="purple" />
              </HStack>
            </Center>
          </Stack>
        </Container>
      </Box>

      {/* Main Content Area - תוכן מרכזי */}
      <Container maxW="5xl" mx="auto" py={16} px={6}>
        {recipes.length === 0 ? (
          <Center w="full">
            <EmptyState />
          </Center>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            {/* כאן ייכנסו כרטיסי המתכונים */}
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