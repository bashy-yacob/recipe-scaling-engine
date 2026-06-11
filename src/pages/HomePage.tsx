// src/pages/HomePage.tsx

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
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { ChefHat, Scale, BookOpen, Sparkles, Check, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { ROUTES } from '@/router';

const MotionBox = motion.create(Box);
const MotionStack = motion.create(Stack);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export function HomePage() {
  return (
    <Box 
      minH="100vh" 
      bg="bg.page" 
      dir="rtl" 
      w="100%"
      display="flex"
      flexDirection="column"
    >
      <Container maxW="5xl" mx="auto" py={{ base: 16, md: 28 }} px={6}>
        
        {/* Hero Section */}
        <MotionStack
          gap={8}
          align="center"
          textAlign="center"
          mb={24}
          initial="hidden"
          animate="visible"
        >
          <MotionBox variants={fadeUp} custom={0}>
            <Box
              bg="brand.500"
              p={4}
              borderRadius="2xl"
              display="inline-flex"
            >
              <ChefHat size={48} color="white" strokeWidth={1.5} />
            </Box>
          </MotionBox>

          <MotionStack gap={4} variants={fadeUp} custom={1}>
            <Heading
              size="4xl"
              fontWeight="extrabold"
              letterSpacing="tight"
              color="fg.heading"
            >
              Recipe{' '}
              <Text as="span" color="fg.brand">Scaling</Text>{' '}
              Engine
            </Heading>
            <Text fontSize="xl" color="fg.muted" maxW="lg" mx="auto" lineHeight="tall">
              ספר המתכונים החכם שלך — עם אלגוריתמי scaling מתקדמים 
              שמבינים את הכימיה של האפייה והבישול.
            </Text>
          </MotionStack>

          <MotionBox variants={fadeUp} custom={2}>
            <Button
              asChild
              size="xl"
              bg="btn.primary.bg"
              color="btn.primary.fg"
              px={10}
              h="56px"
              borderRadius="xl"
              _hover={{ bg: 'btn.primary.hover', transform: 'translateY(-1px)' }}
              transition="all 0.2s"
              fontWeight="bold"
              fontSize="lg"
            >
              <Link to={ROUTES.RECIPES}>
                <ChefHat size={20} />
                <Text ms={2}>התחילי לבשל</Text>
              </Link>
            </Button>
          </MotionBox>
        </MotionStack>

        {/* Features Grid */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={24}>
          <FeatureCard
            icon={<Scale size={28} />}
            title="Smart Scaling"
            description="שינוי כמויות חכם — לא רק הכפלה מתמטית, אלא התאמה לפי חוקי אפייה"
            index={0}
          />
          <FeatureCard
            icon={<BookOpen size={28} />}
            title="ספר מתכונים אישי"
            description="ניהול מסודר עם תמונות, תגיות וחיפוש מהיר בכל רגע נתון"
            index={1}
          />
          <FeatureCard
            icon={<Sparkles size={28} />}
            title="AI מובנה"
            description="ייבוא מתכונים אוטומטי מתמונות, הודעות וואטסאפ או קישורי אינטרנט"
            index={2}
          />
        </SimpleGrid>

        {/* Status Card */}
        <Box maxW="2xl" mx="auto">
          <Card.Root variant="outline" borderRadius="xl" overflow="hidden" borderColor="border.default" bg="bg.surface">
            <Card.Header bg="bg.muted" px={6} py={4} borderBottomWidth="1px" borderColor="border.muted">
              <Heading size="md" color="fg.heading">סטטוס פיתוח</Heading>
            </Card.Header>
            <Card.Body px={6} py={6}>
              <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
                <StatusItem completed text="תשתית פרויקט ו-DB" />
                <StatusItem completed text="עיצוב ממשק Chakra v3" />
                <StatusItem completed text="מיגרציה ל-Vite + React Router" />
                <StatusItem inProgress text="ממשק ניהול מתכונים" />
                <StatusItem text="אלגוריתם Scaling חכם" />
                <StatusItem text="סריקת מתכון מתמונה" />
              </SimpleGrid>
            </Card.Body>
          </Card.Root>
        </Box>

        <Center mt={10}>
          <Text fontSize="sm" color="fg.subtle" fontWeight="medium">
            נבנה באהבה עבור בשלנים ואופים מקצועיים
          </Text>
        </Center>

      </Container>
    </Box>
  );
}

// Feature Card
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

function FeatureCard({ icon, title, description, index }: FeatureCardProps) {
  return (
    <MotionBox
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={fadeUp}
      custom={index}
    >
      <Card.Root 
        variant="outline"
        borderRadius="xl" 
        bg="bg.surface"
        transition="all 0.2s"
        _hover={{ transform: 'translateY(-2px)', shadow: 'md', borderColor: 'border.brand' }}
        borderColor="border.default"
        h="full"
      >
        <Card.Body p={6}>
          <Stack gap={4} align="start">
            <Box p={2.5} borderRadius="lg" bg="bg.brand.subtle" color="fg.brand">
              {icon}
            </Box>
            <Stack gap={1.5}>
              <Heading size="md" fontWeight="bold" color="fg.heading">{title}</Heading>
              <Text color="fg.muted" fontSize="sm" lineHeight="tall">
                {description}
              </Text>
            </Stack>
          </Stack>
        </Card.Body>
      </Card.Root>
    </MotionBox>
  );
}

// Status Item
interface StatusItemProps {
  completed?: boolean;
  inProgress?: boolean;
  text: string;
}

function StatusItem({ completed, inProgress, text }: StatusItemProps) {
  return (
    <HStack gap={2.5} py={1}>
      <Box
        w="20px"
        h="20px"
        borderRadius="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={completed ? 'green.100' : inProgress ? 'brand.100' : 'bg.muted'}
        flexShrink={0}
      >
        {completed ? (
          <Check size={12} color="#059669" strokeWidth={3} />
        ) : inProgress ? (
          <Loader size={12} color="#d97706" strokeWidth={3} />
        ) : (
          <Box w="5px" h="5px" borderRadius="full" bg="fg.subtle" />
        )}
      </Box>
      <Text 
        fontSize="sm" 
        fontWeight={inProgress ? 'semibold' : 'normal'} 
        color={completed ? 'fg.subtle' : 'fg.default'}
        textDecoration={completed ? 'line-through' : 'none'}
      >
        {text}
      </Text>
    </HStack>
  );
}
