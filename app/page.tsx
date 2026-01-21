'use client';

import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Button, 
  SimpleGrid, 
  Stack, 
  HStack, 
  Card, 
  Center,
  Circle
} from '@chakra-ui/react';
import Link from 'next/link';
import { ChefHat, Scale, BookOpen, Sparkles, Check, Loader, ArrowLeft } from 'lucide-react';

export default function HomePage() {
  return (
    <Box 
      minH="100vh" 
      bg="orange.50/30" 
      dir="rtl" 
      w="100%"
      display="flex"
      flexDirection="column"
    >
      <Container maxW="5xl" mx="auto" py={{ base: 12, md: 24 }} px={6}>
        
        {/* Hero Section - כותרת ראשית ממורכזת */}
        <Stack gap={10} align="center" textAlign="center" mb={20}>
          <Box
            bg="orange.500"
            p={5}
            borderRadius="3xl"
            boxShadow="2xl"
            transform="rotate(-5deg)"
          >
            <ChefHat size={60} color="white" strokeWidth={1.5} />
          </Box>

          <Stack gap={4}>
            <Heading
              size="4xl"
              fontWeight="extrabold"
              letterSpacing="tight"
              color="gray.900"
            >
              Recipe{' '}
              <Text as="span" color="orange.500">Scaling</Text>{' '}
              Engine
            </Heading>
            <Text fontSize="xl" color="gray.600" maxW="2xl" mx="auto" lineHeight="tall">
              ספר המתכונים החכם שלך - עם אלגוריתמי scaling מתקדמים 
              שמבינים את הכימיה של האפייה והבישול.
            </Text>
          </Stack>

          <HStack gap={4} mt={4}>
            <Button
              asChild
              size="xl"
              bg="orange.500"
              color="white"
              px={10}
              h="64px"
              borderRadius="2xl"
              _hover={{ bg: 'orange.600', transform: 'translateY(-2px)' }}
              boxShadow="xl"
              transition="all 0.2s"
            >
              <Link href="/dashboard/recipes">
                <HStack gap={3}>
                  <ChefHat size={22} />
                  <Text fontSize="lg" fontWeight="bold">התחילי לבשל</Text>
                </HStack>
              </Link>
            </Button>
          </HStack>
        </Stack>

        {/* Features Grid - 3 עמודות ממורכזות */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={8} mb={24}>
          <FeatureCard
            icon={<Scale size={32} />}
            title="Smart Scaling"
            description="שינוי כמויות חכם - לא רק הכפלה מתמטית, אלא התאמה לפי חוקי אפייה"
            color="blue"
          />
          <FeatureCard
            icon={<BookOpen size={32} />}
            title="ספר מתכונים אישי"
            description="ניהול מסודר עם תמונות, תגיות וחיפוש מהיר בכל רגע נתון"
            color="purple"
          />
          <FeatureCard
            icon={<Sparkles size={32} />}
            title="AI מובנה"
            description="ייבוא מתכונים אוטומטי מתמונות, הודעות וואטסאפ או קישורי אינטרנט"
            color="pink"
          />
        </SimpleGrid>

        {/* Status Card - סטטוס פרויקט ממורכז */}
        <Box maxW="2xl" mx="auto">
          <Card.Root variant="raised" borderRadius="3xl" overflow="hidden" boxShadow="sm">
            <Card.Header bg="gray.50" px={8} py={5} borderBottomWidth="1px">
              <HStack justify="space-between">
                <Heading size="md">סטטוס פיתוח המערכת</Heading>
                {/* <Badge colorPalette="orange" variant="surface">גרסה 1.0</Badge> */}
              </HStack>
            </Card.Header>
            <Card.Body px={8} py={8}>
              <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                <StatusItem completed text="תשתית פרויקט ו-DB" />
                <StatusItem completed text="עיצוב ממשק Chakra v3" />
                <StatusItem inProgress text="ממשק ניהול מתכונים" />
                <StatusItem text="אלגוריתם Scaling חכם" />
                <StatusItem text="סריקת מתכון מתמונה" />
                <StatusItem text="פילטור וחיפוש" />
              </SimpleGrid>
            </Card.Body>
          </Card.Root>
        </Box>

        <Center mt={12}>
          <Text fontSize="sm" color="gray.400" fontWeight="medium">
            נבנה באהבה עבור בשלנים ואופים מקצועיים
          </Text>
        </Center>

      </Container>
    </Box>
  );
}

// קומפוננטת כרטיס פיצ'ר
function FeatureCard({ icon, title, description, color }: any) {
  return (
    <Card.Root 
      variant="outline"
      borderRadius="3xl" 
      bg="white"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-8px)', boxShadow: '2xl', borderColor: `${color}.200` }}
      borderWidth="1px"
      borderColor="gray.100"
    >
      <Card.Body p={8}>
        <Stack gap={5} align="start">
          <Circle size="60px" bg={`${color}.50`} color={`${color}.500`}>
            {icon}
          </Circle>
          <Stack gap={2}>
            <Heading size="md" fontWeight="bold">{title}</Heading>
            <Text color="gray.500" fontSize="sm" lineHeight="tall">
              {description}
            </Text>
          </Stack>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}

// קומפוננטת שורת סטטוס
function StatusItem({ completed, inProgress, text }: any) {
  return (
    <HStack gap={3} py={1}>
      <Circle 
        size="24px" 
        bg={completed ? 'green.100' : inProgress ? 'orange.100' : 'gray.100'}
      >
        {completed ? (
          <Check size={14} color="#059669" strokeWidth={3} />
        ) : inProgress ? (
          <Loader size={14} color="#d97706" strokeWidth={3} />
        ) : (
          <Box w="6px" h="6px" borderRadius="full" bg="gray.300" />
        )}
      </Circle>
      <Text 
        fontSize="sm" 
        fontWeight={inProgress ? "bold" : "medium"} 
        color={completed ? "gray.400" : "gray.700"}
        textDecoration={completed ? "line-through" : "none"}
      >
        {text}
      </Text>
    </HStack>
  );
}