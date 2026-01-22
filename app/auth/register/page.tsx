"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Box, Button, Input, Text, VStack, Heading, Card, Stack, Link as ChakraLink } from "@chakra-ui/react";
import { Mail, Lock, User, ChefHat, ArrowRight, Chrome } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("הסיסמאות אינן תואמות");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage("הסיסמה חייבת להכיל לפחות 6 תווים");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "שגיאה בהרשמה");
        return;
      }

      // Auto login after registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/auth/login");
      } else {
        router.push("/dashboard/recipes");
        router.refresh();
      }
    } catch {
      setErrorMessage("שגיאה בהרשמה");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard/recipes" });
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
                            <Heading size="lg" fontWeight="bold">הרשמה</Heading>
                            <Text color="gray.500">צרו חשבון חדש כדי לשמור מתכונים</Text>
                        </VStack>

                         {errorMessage && (
                            <Box w="full" p={3} bg="red.50" borderRadius="xl" borderWidth={1} borderColor="red.200">
                              <Text color="red.600" textAlign="center" fontSize="sm" fontWeight="medium">{errorMessage}</Text>
                            </Box>
                          )}

                        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                            <VStack gap={5} w="full">
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
                                        pr={10} // Hebrew Name - Icon Right
                                        required
                                        size="lg"
                                        borderRadius="xl"
                                        bg="gray.50"
                                        border="0"
                                        _focus={{ bg: "white", ring: 2, ringColor: "orange.500" }}
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
                                        border="0"
                                        _focus={{ bg: "white", ring: 2, ringColor: "orange.500" }}
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
                                        border="0"
                                        _focus={{ bg: "white", ring: 2, ringColor: "orange.500" }}
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
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        pr={10}
                                        pl={4}
                                        required
                                        dir="ltr"
                                        size="lg"
                                        borderRadius="xl"
                                        bg="gray.50"
                                        border="0"
                                        _focus={{ bg: "white", ring: 2, ringColor: "orange.500" }}
                                      />
                                    </Box>
                                </Box>
                                
                                <Button 
                                    type="submit" 
                                    w="full" 
                                    size="lg" 
                                    colorPalette="orange"
                                    bg="orange.500" 
                                    _hover={{ bg: "orange.600", transform: "translateY(-2px)" }}
                                    borderRadius="xl"
                                    loading={isLoading}
                                    mt={2}
                                    transition="all 0.2s"
                                    fontWeight="bold"
                                    color="white"
                                >
                                    הרשמה
                                </Button>

                                <Box position="relative" w="full" py={2}>
                                    <Box position="absolute" left={0} top="50%" w="full" h="1px" bg="gray.200" />
                                    <Box position="relative" bg="white" px={2} mx="auto" w="fit-content" color="gray.500" fontSize="sm">
                                        או
                                    </Box>
                                </Box>

                                <Button
                                    variant="outline"
                                    w="full"
                                    size="lg"
                                    onClick={handleGoogleSignIn}
                                    borderRadius="xl"
                                    transition="all 0.2s"
                                    _hover={{ bg: "gray.50" }}
                                >
                                    <Chrome size={20} />
                                    <Text mr={2}>התחברות עם Google</Text>
                                </Button>
                            </VStack>
                        </form>
                    </VStack>
                 </Card.Body>
                 <Card.Footer bg="gray.50" p={6} justifyContent="center" borderTopWidth="1px" borderColor="gray.100">
                    <Text fontSize="sm" color="gray.600">
                        כבר יש לך חשבון?{' '}
                        <ChakraLink asChild color="orange.600" fontWeight="bold" _hover={{ textDecoration: "underline" }}>
                            <Link href="/auth/login">
                                התחברי כאן
                            </Link>
                        </ChakraLink>
                    </Text>
                 </Card.Footer>
            </Card.Root>
            
             <Button variant="ghost" asChild color="gray.500" _hover={{ color: "gray.800", bg: "whiteAlpha.500" }}>
                <Link href="/">
                    <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                    חזרה לדף הבית
                </Link>
            </Button>
        </Stack>
    </Box>
  );
}
