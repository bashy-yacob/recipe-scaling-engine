'use client';

import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { ServerCrash, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <Container maxW="lg" py={20}>
          <VStack gap={8} textAlign="center">
            <Box color="red.500">
              <ServerCrash size={80} strokeWidth={1.5} />
            </Box>
            
            <VStack gap={3}>
              <Heading size="2xl" color="gray.800">
                שגיאה קריטית
              </Heading>
              <Text color="gray.600" fontSize="lg" maxW="md">
                מצטערים מאוד, אירעה שגיאה קריטית באפליקציה. אנא נסו לרענן את הדף.
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
                colorScheme="red"
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
      </body>
    </html>
  );
}
