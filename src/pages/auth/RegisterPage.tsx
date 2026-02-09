// src/pages/auth/RegisterPage.tsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Input, Text, VStack, Heading, Card, Stack } from '@chakra-ui/react';
import { Mail, Lock, User, ChefHat } from 'lucide-react';
import { ROUTES } from '@/router';
import { toaster } from '@/components/ui/toaster';

export function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('הסיסמאות אינן תואמות');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage('הסיסמה חייבת להכיל לפחות 6 תווים');
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Implement actual registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toaster.create({ title: 'נרשמת בהצלחה!', type: 'success' });
      navigate(ROUTES.LOGIN);
    } catch {
      setErrorMessage('שגיאה בהרשמה. נסה שנית.');
    } finally {
      setIsLoading(false);
    }
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
                <Heading size="lg" fontWeight="bold">יצירת חשבון</Heading>
                <Text color="gray.500">הצטרף אלינו והתחל לנהל את המתכונים שלך</Text>
              </VStack>

              {errorMessage && (
                <Box w="full" p={3} bg="red.50" borderRadius="xl" borderWidth={1} borderColor="red.200">
                  <Text color="red.600" textAlign="center" fontSize="sm" fontWeight="medium">{errorMessage}</Text>
                </Box>
              )}

              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <VStack gap={4} w="full">
                  <Box w="full">
                    <Text mb={2} fontWeight="bold" fontSize="sm" color="gray.700">שם מלא</Text>
                    <Box position="relative">
                      <Box position="absolute" right={3} top="50%" transform="translateY(-50%)" zIndex={2} color="gray.400">
                        <User size={18} />
                      </Box>
                      <Input
                        type="text"
                        placeholder="השם שלך"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        pr={10}
                        pl={4}
                        required
                        size="lg"
                        borderRadius="xl"
                        bg="gray.50"
                        _focus={{ bg: 'white', borderColor: 'orange.500' }}
                      />
                    </Box>
                  </Box>

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
                        placeholder="לפחות 6 תווים"
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

                  <Box w="full">
                    <Text mb={2} fontWeight="bold" fontSize="sm" color="gray.700">אימות סיסמה</Text>
                    <Box position="relative">
                      <Box position="absolute" right={3} top="50%" transform="translateY(-50%)" zIndex={2} color="gray.400">
                        <Lock size={18} />
                      </Box>
                      <Input
                        type="password"
                        placeholder="הזן שוב את הסיסמה"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                    loadingText="נרשם..."
                    mt={2}
                  >
                    צור חשבון
                  </Button>
                </VStack>
              </form>

              <Text color="gray.500" fontSize="sm">
                כבר יש לך חשבון?{' '}
                <Link to={ROUTES.LOGIN}>
                  <Text as="span" color="orange.500" fontWeight="bold" _hover={{ textDecoration: 'underline' }}>
                    התחבר
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
