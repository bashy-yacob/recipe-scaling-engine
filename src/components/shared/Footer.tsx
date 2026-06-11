// src/components/shared/Footer.tsx

import {
  Box,
  Container,
  Stack,
  Text,
  HStack,
  Separator,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { ChefHat, Heart } from 'lucide-react';
import { ROUTES } from '@/router';

export function Footer() {
  return (
    <Box bg="bg.surface" borderTop="1px solid" borderColor="border.muted" pt={10} pb={6} dir="rtl">
      <Container maxW="5xl" mx="auto" px={6}>
        <HStack 
          justify="space-between" 
          align="start" 
          flexWrap="wrap" 
          gap={8} 
          mb={8}
        >
          {/* לוגו ותיאור */}
          <Stack gap={3} maxW="280px">
            <HStack gap={2}>
              <Box bg="brand.500" p={1.5} borderRadius="lg">
                <ChefHat size={18} color="white" />
              </Box>
              <Text fontSize="md" fontWeight="extrabold" color="fg.heading">
                Recipe <Text as="span" color="fg.brand">Scaling</Text>
              </Text>
            </HStack>
            <Text color="fg.muted" fontSize="sm" lineHeight="tall">
              מנוע חכם לניהול ושינוי כמויות במתכונים, מותאם לאופים ובשלנים.
            </Text>
          </Stack>

          {/* ניווט */}
          <Stack gap={2}>
            <Text fontWeight="semibold" fontSize="sm" color="fg.heading" mb={1}>ניווט</Text>
            <FooterLink href={ROUTES.HOME}>דף הבית</FooterLink>
            <FooterLink href={ROUTES.RECIPES}>המתכונים שלי</FooterLink>
            <FooterLink href={ROUTES.RECIPE_NEW}>הוספת מתכון</FooterLink>
          </Stack>

          {/* משאבים */}
          <Stack gap={2}>
            <Text fontWeight="semibold" fontSize="sm" color="fg.heading" mb={1}>משאבים</Text>
            <FooterLink href={ROUTES.DEMO}>ספריית רכיבים</FooterLink>
            <FooterLink href="#">קוד פתוח</FooterLink>
          </Stack>
        </HStack>

        <Separator borderColor="border.muted" mb={6} />

        <HStack justify="space-between" flexWrap="wrap" gap={3}>
          <Text fontSize="xs" color="fg.subtle">
            © {new Date().getFullYear()} Recipe Scaling Engine
          </Text>
          <HStack gap={1} fontSize="xs" color="fg.subtle">
            <Text>נבנה עם</Text>
            <Heart size={11} color="#f97316" fill="#f97316" />
            <Text>עבור בשלנים שאוהבים דיוק</Text>
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link to={href}>
      <Text 
        fontSize="sm" 
        color="fg.muted" 
        transition="color 0.15s" 
        _hover={{ color: 'fg.brand' }}
      >
        {children}
      </Text>
    </Link>
  );
}
