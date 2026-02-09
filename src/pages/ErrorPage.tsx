// src/pages/ErrorPage.tsx

import { Box, Button, Center, Heading, Text, VStack } from '@chakra-ui/react';
import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { ROUTES } from '@/router';

export function ErrorPage() {
  const error = useRouteError();

  let errorMessage = 'משהו השתבש. נסה שוב מאוחר יותר.';
  let errorTitle = 'שגיאה';

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      errorTitle = 'העמוד לא נמצא';
      errorMessage = 'הדף שחיפשת לא קיים.';
    } else if (error.status === 500) {
      errorTitle = 'שגיאת שרת';
      errorMessage = 'אירעה שגיאה בשרת. נסה שוב בעוד כמה דקות.';
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <Box minH="100vh" bg="gray.50" dir="rtl">
      <Center h="100vh">
        <VStack gap={6} textAlign="center" p={8}>
          <Box
            bg="red.100"
            p={6}
            borderRadius="3xl"
          >
            <AlertTriangle size={64} color="#dc2626" />
          </Box>
          
          <VStack gap={2}>
            <Heading size="2xl" color="gray.800" fontWeight="extrabold">
              {errorTitle}
            </Heading>
            <Text color="gray.500" fontSize="lg" maxW="md">
              {errorMessage}
            </Text>
          </VStack>

          <VStack gap={3}>
            <Button
              onClick={() => window.location.reload()}
              bg="orange.500"
              color="white"
              size="lg"
              borderRadius="xl"
              px={8}
              _hover={{ bg: 'orange.600' }}
            >
              <RefreshCw size={20} style={{ marginLeft: '8px' }} />
              נסה שוב
            </Button>

            <Button
              asChild
              variant="outline"
              colorPalette="gray"
              size="lg"
              borderRadius="xl"
              px={8}
            >
              <Link to={ROUTES.HOME}>
                <Home size={20} style={{ marginLeft: '8px' }} />
                חזרה לדף הבית
              </Link>
            </Button>
          </VStack>
        </VStack>
      </Center>
    </Box>
  );
}
