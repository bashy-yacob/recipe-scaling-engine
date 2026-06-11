// src/pages/auth/RegisterPage.tsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Input, Text, VStack, Heading, Card, Stack } from '@chakra-ui/react';
import { Mail, Lock, User, ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';
import { ROUTES } from '@/router';
import { toaster } from '@/components/ui/toaster';

const MotionBox = motion.create(Box);

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
    <Box minH="100vh" bg="bg.page" display="flex" alignItems="center" justifyContent="center" p={4} dir="rtl">
      <MotionBox
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        w="full"
        maxW="md"
      >
        <Stack gap={6} align="center">
          {/* Logo */}
          <Stack align="center" gap={3}>
            <Box bg="brand.500" p={3} borderRadius="xl">
              <ChefHat size={32} color="white" strokeWidth={1.5} />
            </Box>
            <Heading size="xl" fontWeight="extrabold" color="fg.heading">
              Recipe Scaling
            </Heading>
          </Stack>

          <Card.Root variant="outline" w="full" borderRadius="xl" borderColor="border.default" bg="bg.surface" overflow="hidden">
            <Card.Body p={{ base: 6, md: 8 }}>
              <VStack gap={5}>
                <VStack gap={1} align="center" textAlign="center">
                  <Heading size="lg" fontWeight="bold" color="fg.heading">יצירת חשבון</Heading>
                  <Text color="fg.muted" fontSize="sm">הצטרף אלינו והתחל לנהל את המתכונים שלך</Text>
                </VStack>

                {errorMessage && (
                  <Box w="full" p={3} bg="red.50" borderRadius="lg" borderWidth={1} borderColor="red.200">
                    <Text color="red.600" textAlign="center" fontSize="sm">{errorMessage}</Text>
                  </Box>
                )}

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                  <VStack gap={4} w="full">
                    <Box w="full">
                      <Text mb={1.5} fontWeight="medium" fontSize="sm" color="fg.default">שם מלא</Text>
                      <Box position="relative">
                        <Box position="absolute" right={3} top="50%" transform="translateY(-50%)" zIndex={2} color="fg.subtle">
                          <User size={16} />
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
                          borderRadius="lg"
                          bg="bg.subtle"
                          borderColor="border.default"
                          _focus={{ bg: 'bg.surface', borderColor: 'brand.500' }}
                        />
                      </Box>
                    </Box>

                    <Box w="full">
                      <Text mb={1.5} fontWeight="medium" fontSize="sm" color="fg.default">אימייל</Text>
                      <Box position="relative">
                        <Box position="absolute" right={3} top="50%" transform="translateY(-50%)" zIndex={2} color="fg.subtle">
                          <Mail size={16} />
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
                          borderRadius="lg"
                          bg="bg.subtle"
                          borderColor="border.default"
                          _focus={{ bg: 'bg.surface', borderColor: 'brand.500' }}
                        />
                      </Box>
                    </Box>

                    <Box w="full">
                      <Text mb={1.5} fontWeight="medium" fontSize="sm" color="fg.default">סיסמה</Text>
                      <Box position="relative">
                        <Box position="absolute" right={3} top="50%" transform="translateY(-50%)" zIndex={2} color="fg.subtle">
                          <Lock size={16} />
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
                          borderRadius="lg"
                          bg="bg.subtle"
                          borderColor="border.default"
                          _focus={{ bg: 'bg.surface', borderColor: 'brand.500' }}
                        />
                      </Box>
                    </Box>

                    <Box w="full">
                      <Text mb={1.5} fontWeight="medium" fontSize="sm" color="fg.default">אימות סיסמה</Text>
                      <Box position="relative">
                        <Box position="absolute" right={3} top="50%" transform="translateY(-50%)" zIndex={2} color="fg.subtle">
                          <Lock size={16} />
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
                          borderRadius="lg"
                          bg="bg.subtle"
                          borderColor="border.default"
                          _focus={{ bg: 'bg.surface', borderColor: 'brand.500' }}
                        />
                      </Box>
                    </Box>

                    <Button
                      type="submit"
                      w="full"
                      bg="btn.primary.bg"
                      color="btn.primary.fg"
                      size="lg"
                      borderRadius="lg"
                      _hover={{ bg: 'btn.primary.hover' }}
                      loading={isLoading}
                      loadingText="נרשם..."
                      fontWeight="semibold"
                      mt={1}
                    >
                      צור חשבון
                    </Button>
                  </VStack>
                </form>

                <Text color="fg.muted" fontSize="sm">
                  כבר יש לך חשבון?{' '}
                  <Link to={ROUTES.LOGIN}>
                    <Text as="span" color="fg.brand" fontWeight="semibold" _hover={{ textDecoration: 'underline' }}>
                      התחבר
                    </Text>
                  </Link>
                </Text>
              </VStack>
            </Card.Body>
          </Card.Root>
        </Stack>
      </MotionBox>
    </Box>
  );
}
