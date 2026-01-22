'use client';

import { useEffect } from 'react';
import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <Container maxW="lg" py={20}>
      <VStack gap={8} textAlign="center">
        <Box color="red.500">
          <AlertTriangle size={80} strokeWidth={1.5} />
        </Box>
        
        <VStack gap={3}>
          <Heading size="2xl" color="gray.800">
            משהו השתבש
          </Heading>
          <Text color="gray.600" fontSize="lg" maxW="md">
            מצטערים, אירעה שגיאה בלתי צפויה. אנא נסו שוב או חזרו לדף הבית.
          </Text>
          {error.digest && (
            <Text color="gray.400" fontSize="sm">
              קוד שגיאה: {error.digest}
            </Text>
          )}
        </VStack>

        <VStack gap={3} w="full" maxW="xs">
          <Button
            onClick={reset}
            colorPalette="orange"
            size="lg"
            w="full"
            borderRadius="xl"
          >
            <RefreshCw size={20} />
            נסה שוב
          </Button>
          
          <Button
            asChild
            variant="outline"
            size="lg"
            w="full"
            borderRadius="xl"
          >
            <Link href="/">
              <Home size={20} />
              חזור לדף הבית
            </Link>
          </Button>
        </VStack>
      </VStack>
    </Container>
  );
}
