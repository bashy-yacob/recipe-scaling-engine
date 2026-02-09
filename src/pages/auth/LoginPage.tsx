// src/pages/auth/LoginPage.tsx

import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Button, Input, Text, VStack, Heading, Card, Stack } from '@chakra-ui/react';
import { Mail, Lock, ChefHat, Chrome } from 'lucide-react';
import { ROUTES } from '@/router';
import { toaster } from '@/components/ui/toaster';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || ROUTES.RECIPES;
  const error = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(error ? 'שגיאה בהתחברות' : '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      // TODO: Implement actual authentication
      // For now, simulate login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toaster.create({ title: 'התחברת בהצלחה!', type: 'success' });
      navigate(callbackUrl);
    } catch {
      setErrorMessage('אימייל או סיסמה שגויים');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google OAuth
    toaster.create({ title: 'התחברות עם Google תתווסף בקרוב', type: 'info' });
  };

  return (
    <Box minH="100vh" bg="orange.50/30" display="flex" alignItems="center" justifyContent="center" p={4} dir="rtl">
      <Stack gap={8} align="center" w="full" maxW="md">
        
        {/* Logo Section */}
        <Stack align="center" gap={4}>
          <Box
            bg="orange.500"
            p={4}
            borderRadius="2xl"
            boxShadow="lg"
            transform="rotate(-5deg)"
          >
            <ChefHat size={40} color="white" strokeWidth={1.5} />
          </Box>
          <Heading size="2xl" fontWeight="extrabold" color="gray.800">
            Recipe Scaling
          </Heading>
        </Stack>

        <Card.Root variant="elevated" w="full" borderRadius="3xl" boxShadow="xl" bg="white" overflow="hidden">
          <Card.Body p={8}>
            <VStack gap={6}>
              <VStack gap={2} align="center" textAlign="center">
                <Heading size="lg" fontWeight="bold">התחברות</Heading>
                <Text color="gray.500">הזינו פרטים כדי להתחבר לחשבון</Text>
              </VStack>

              {errorMessage && (
                <Box w="full" p={3} bg="red.50" borderRadius="xl" borderWidth={1} borderColor="red.200">
                  <Text color="red.600" textAlign="center" fontSize="sm" fontWeight="medium">{errorMessage}</Text>
                </Box>
              )}

              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <VStack gap={5} w="full">
                  <Box w="full">
                    <Text mb={2} fontWeight="bold" fontSize="sm" color="gray.700">אימייל</Text>
                    <Box position="relative">
                      <Box position="absolute" right={3} top="50%" transform="translateY(-50%)" zIndex={2} color="gray.400">
                        <Mail size={18} />
                      </Box>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        pr={10}
                        pl={4}
                        required
                        dir="ltr"
                        size="lg"
                        borderRadius="xl"
                        bg="gray.50"
                        _focus={{ bg: 'white', borderColor: 'orange.500' }}
                      />
                    </Box>
                  </Box>

                  <Box w="full">
                    <Text mb={2} fontWeight="bold" fontSize="sm" color="gray.700">סיסמה</Text>
                    <Box position="relative">
                      <Box position="absolute" right={3} top="50%" transform="translateY(-50%)" zIndex={2} color="gray.400">
                        <Lock size={18} />
                      </Box>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        pr={10}
                        pl={4}
                        required
                        dir="ltr"
                        size="lg"
                        borderRadius="xl"
                        bg="gray.50"
                        _focus={{ bg: 'white', borderColor: 'orange.500' }}
                      />
                    </Box>
                  </Box>

                  <Button
                    type="submit"
                    w="full"
                    bg="orange.500"
                    color="white"
                    size="lg"
                    borderRadius="xl"
                    _hover={{ bg: 'orange.600' }}
                    loading={isLoading}
                    loadingText="מתחבר..."
                  >
                    התחבר
                  </Button>
                </VStack>
              </form>

              <Box w="full" textAlign="center">
                <Text color="gray.400" fontSize="sm">או</Text>
              </Box>

              <Button
                w="full"
                variant="outline"
                size="lg"
                borderRadius="xl"
                onClick={handleGoogleSignIn}
              >
                <Chrome size={20} style={{ marginLeft: '8px' }} />
                המשך עם Google
              </Button>

              <Text color="gray.500" fontSize="sm">
                אין לך חשבון?{' '}
                <Link to={ROUTES.REGISTER}>
                  <Text as="span" color="orange.500" fontWeight="bold" _hover={{ textDecoration: 'underline' }}>
                    הרשמה
                  </Text>
                </Link>
              </Text>
            </VStack>
          </Card.Body>
        </Card.Root>
      </Stack>
    </Box>
  );
}
