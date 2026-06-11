// src/pages/NotFoundPage.tsx

import { Box, Button, Center, Heading, Text, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { Home, ChefHat } from 'lucide-react';
import { ROUTES } from '@/router';

export function NotFoundPage() {
  return (
    <Box minH="80vh" bg="bg.page" dir="rtl">
      <Center h="80vh">
        <VStack gap={5} textAlign="center" p={8}>
          <Box bg="bg.brand.subtle" p={5} borderRadius="xl">
            <ChefHat size={48} color="var(--chakra-colors-brand-500)" />
          </Box>
          
          <Heading size="3xl" color="fg.heading" fontWeight="bold">
            404
          </Heading>
          
          <VStack gap={1.5}>
            <Heading size="lg" color="fg.heading">
              העמוד לא נמצא
            </Heading>
            <Text color="fg.muted" fontSize="md" maxW="sm">
              נראה שהדף שחיפשת לא קיים. אולי הוא הוסר או שהכתובת שגויה.
            </Text>
          </VStack>

          <Button
            asChild
            bg="btn.primary.bg"
            color="btn.primary.fg"
            _hover={{ bg: 'btn.primary.hover' }}
            borderRadius="lg"
            px={6}
          >
            <Link to={ROUTES.HOME}>
              <Home size={18} />
              <Text ms={1}>חזרה לדף הבית</Text>
            </Link>
          </Button>
        </VStack>
      </Center>
    </Box>
  );
}
