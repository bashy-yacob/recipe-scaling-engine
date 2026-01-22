import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { FileQuestion, Home, Search } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Container maxW="lg" py={20}>
      <VStack gap={8} textAlign="center">
        <Box color="orange.400">
          <FileQuestion size={100} strokeWidth={1.5} />
        </Box>
        
        <VStack gap={3}>
          <Heading size="4xl" color="orange.500" fontWeight="black">
            404
          </Heading>
          <Heading size="xl" color="gray.800">
            הדף לא נמצא
          </Heading>
          <Text color="gray.600" fontSize="lg" maxW="md">
            מצטערים, הדף שחיפשת לא קיים או שהועבר למקום אחר.
          </Text>
        </VStack>

        <VStack gap={3} w="full" maxW="xs">
          <Button
            asChild
            colorPalette="orange"
            size="lg"
            w="full"
            borderRadius="xl"
          >
            <Link href="/">
              <Home size={20} />
              חזור לדף הבית
            </Link>
          </Button>
          
          <Button
            asChild
            variant="outline"
            size="lg"
            w="full"
            borderRadius="xl"
          >
            <Link href="/dashboard/recipes">
              <Search size={20} />
              חפש מתכונים
            </Link>
          </Button>
        </VStack>
      </VStack>
    </Container>
  );
}
