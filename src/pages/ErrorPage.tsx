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
    <Box minH="100vh" bg="bg.page" dir="rtl">
      <Center h="100vh">
        <VStack gap={5} textAlign="center" p={8}>
          <Box bg="red.100" _dark={{ bg: 'red.900/30' }} p={5} borderRadius="xl">
            <AlertTriangle size={48} color="#dc2626" />
          </Box>
          
          <VStack gap={1.5}>
            <Heading size="xl" color="fg.heading" fontWeight="bold">
              {errorTitle}
            </Heading>
            <Text color="fg.muted" fontSize="md" maxW="sm">
              {errorMessage}
            </Text>
          </VStack>

          <VStack gap={2}>
            <Button
              onClick={() => window.location.reload()}
              bg="btn.primary.bg"
              color="btn.primary.fg"
              _hover={{ bg: 'btn.primary.hover' }}
              borderRadius="lg"
              px={6}
            >
              <RefreshCw size={18} />
              <Text ms={1}>נסה שוב</Text>
            </Button>

            <Button
              asChild
              variant="outline"
              borderColor="border.default"
              color="fg.default"
              borderRadius="lg"
              px={6}
            >
              <Link to={ROUTES.HOME}>
                <Home size={18} />
                <Text ms={1}>חזרה לדף הבית</Text>
              </Link>
            </Button>
          </VStack>
        </VStack>
      </Center>
    </Box>
  );
}
