import { Box, Container, Heading, Spinner, Text, VStack } from '@chakra-ui/react';

export default function Loading() {
  return (
    <Container maxW="lg" py={20}>
      <VStack gap={6} textAlign="center">
        <Box color="orange.500">
          <Spinner size="xl" borderWidth={4} />
        </Box>
        
        <VStack gap={2}>
          <Heading size="lg" color="gray.700">
            טוען...
          </Heading>
          <Text color="gray.500">
            רק רגע, מכינים את הכל
          </Text>
        </VStack>
      </VStack>
    </Container>
  );
}
