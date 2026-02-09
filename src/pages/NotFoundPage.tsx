// src/pages/NotFoundPage.tsx

import { Box, Button, Center, Heading, Text, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { Home, ChefHat } from 'lucide-react';
import { ROUTES } from '@/router';

export function NotFoundPage() {
  return (
    <Box minH="80vh" bg="gray.50" dir="rtl">
      <Center h="80vh">
        <VStack gap={6} textAlign="center" p={8}>
          <Box
            bg="orange.100"
            p={6}
            borderRadius="3xl"
          >
            <ChefHat size={64} color="#ea580c" />
          </Box>
          
          <Heading size="4xl" color="gray.800" fontWeight="extrabold">
            404
          </Heading>
          
          <VStack gap={2}>
            <Heading size="xl" color="gray.700">
              העמוד לא נמצא
            </Heading>
            <Text color="gray.500" fontSize="lg" maxW="md">
              נראה שהדף שחיפשת לא קיים. אולי הוא הוסר או שהכתובת שגויה.
            </Text>
          </VStack>

          <Button
            asChild
            bg="orange.500"
            color="white"
            size="lg"
            borderRadius="xl"
            px={8}
            _hover={{ bg: 'orange.600' }}
          >
            <Link to={ROUTES.HOME}>
              <Home size={20} style={{ marginLeft: '8px' }} />
              חזרה לדף הבית
            </Link>
          </Button>
        </VStack>
      </Center>
    </Box>
  );
}
