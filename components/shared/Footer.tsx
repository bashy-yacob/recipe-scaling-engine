'use client';

import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  HStack,
  Circle,
  Separator,
} from '@chakra-ui/react';
import Link from 'next/link';
import { ChefHat, BookOpen, Plus, Layout, Github, Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <Box bg="white" borderTop="1px" borderColor="gray.100" pt={16} pb={8} dir="rtl">
      <Container maxW="5xl" mx="auto" px={6}>
        <SimpleGrid columns={{ base: 1, md: 4 }} gap={12} mb={12}>
          
          {/* לוגו ותיאור קצר */}
          <Stack gap={4} gridColumn={{ md: "span 1.5" }}>
            <HStack gap={3}>
              <Circle bg="orange.500" p={2} boxShadow="md">
                <ChefHat size={24} color="white" />
              </Circle>
              <Text fontSize="xl" fontWeight="black" letterSpacing="tight">
                Recipe <Text as="span" color="orange.500">Scaling</Text>
              </Text>
            </HStack>
            <Text color="gray.500" fontSize="sm" lineHeight="tall" maxW="300px">
              מנוע חכם לניהול ושינוי כמויות במתכונים בצורה מקצועית, 
              המותאם במיוחד לאופים ובשלנים שאוהבים דיוק.
            </Text>
          </Stack>

          {/* ניווט מהיר */}
          <Stack gap={4}>
            <Text fontWeight="bold" fontSize="md" color="gray.800">ניווט מהיר</Text>
            <Stack gap={2}>
              <FooterLink href="/" icon={ChefHat}>דף הבית</FooterLink>
              <FooterLink href="/dashboard/recipes" icon={BookOpen}>המתכונים שלי</FooterLink>
              <FooterLink href="/dashboard/recipes/new" icon={Plus}>הוספת מתכון</FooterLink>
            </Stack>
          </Stack>

          {/* משאבים ופיתוח */}
          <Stack gap={4}>
            <Text fontWeight="bold" fontSize="md" color="gray.800">משאבים</Text>
            <Stack gap={2}>
              <FooterLink href="/demo" icon={Layout}>ספריית רכיבים (Demo)</FooterLink>
              <FooterLink href="#" icon={Github}>קוד פתוח</FooterLink>
              <FooterLink href="#" icon={Mail}>צור קשר</FooterLink>
            </Stack>
          </Stack>

        </SimpleGrid>

        <Separator borderColor="gray.100" mb={8} />

        {/* שורת זכויות יוצרים תחתונה */}
        <Stack 
          direction={{ base: 'column', md: 'row' }} 
          justify="space-between" 
          align="center" 
          gap={4}
        >
          <Text fontSize="xs" color="gray.400">
            © {new Date().getFullYear()} Recipe Scaling Engine. כל הזכויות שמורות.
          </Text>
          
          <HStack gap={1} fontSize="xs" color="gray.400">
            <Text>נבנה עם</Text>
            <Heart size={12} color="#f97316" fill="#f97316" />
            <Text>עבור בשלנים שאוהבים דיוק</Text>
          </HStack>

          <HStack gap={4}>
            <Text fontSize="xs" color="gray.400" fontWeight="bold">v1.0.0</Text>
          </HStack>
        </Stack>
      </Container>
    </Box>
  );
}

// קומפוננטת עזר לקישור בפוטר
function FooterLink({ href, children, icon: Icon }: any) {
  return (
    <Link href={href} passHref>
      <HStack 
        gap={2} 
        color="gray.500" 
        transition="all 0.2s" 
        _hover={{ color: 'orange.500', transform: 'translateX(-4px)' }}
      >
        <Icon size={16} />
        <Text fontSize="sm" fontWeight="medium">{children}</Text>
      </HStack>
    </Link>
  );
}
