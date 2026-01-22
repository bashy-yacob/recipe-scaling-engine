"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Text,
  VStack,
  HStack,
  Card,
  Spinner,
  Stack,
  Separator,
} from "@chakra-ui/react";
import { Settings, User, Scale, Save, Check } from "lucide-react";
import { toaster } from "@/components/ui/toaster";

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [preferredSystem, setPreferredSystem] = useState("metric");
  const [language, setLanguage] = useState("he");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
    }
  }, [session]);

  if (status === "loading") {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
          <VStack gap={4}>
            <Spinner size="xl" color="orange.500" />
            <Text color="gray.500" fontWeight="medium">טוען הגדרות...</Text>
          </VStack>
      </Box>
    );
  }

  if (!session) {
    router.push("/auth/login");
    return null;
  }

  const handleSave = async () => {
    setIsLoading(true);
    setIsSaved(false);

    try {
      const response = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          preferredSystem,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      // Update session with new name
      await update({ name });

      setIsSaved(true);
      toaster.success({
        title: "ההגדרות נשמרו בהצלחה!",
      });

      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      toaster.error({
        title: "שגיאה בשמירת ההגדרות",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" dir="rtl" w="100%">
        {/* Header Section */}
        <Box bg="white" borderBottom="1px" borderColor="gray.200" boxShadow="sm" w="100%">
            <Container maxW="5xl" mx="auto" py={10} px={6}>
              <HStack gap={6} align="center">
                <Box bg="orange.100" p={4} borderRadius="2xl">
                    <Settings size={32} color="#ea580c" />
                </Box>
                <Stack gap={1}>
                    <Heading size="2xl" fontWeight="extrabold" color="gray.900">
                    הגדרות
                    </Heading>
                    <Text color="gray.500" fontSize="lg">
                    ניהול פרופיל והעדפות אישיות
                    </Text>
                </Stack>
              </HStack>
            </Container>
        </Box>

        {/* Main Content */}
        <Container maxW="5xl" mx="auto" py={12} px={6}>
            <Card.Root variant="elevated" borderRadius="2xl" boxShadow="sm" overflow="hidden" bg="white">
                <Card.Body p={{ base: 6, md: 10 }}>
                    <Stack gap={10} separator={<Separator borderColor="gray.100" />}>
                        
                        {/* Profile Section */}
                        <Stack gap={6}>
                            <HStack gap={3}>
                                <User size={20} color="#f97316" />
                                <Heading size="md">פרטים אישיים</Heading>
                            </HStack>
                            <Box maxW="md">
                                <Text mb={2} fontWeight="medium" fontSize="sm" color="gray.700">שם מלא</Text>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="השם שלך"
                                    size="lg"
                                    borderRadius="xl"
                                    bg="gray.50"
                                    border="0"
                                    _focus={{ bg: "white", ring: 2, ringColor: "orange.500" }}
                                />
                                <Text fontSize="xs" color="gray.400" mt={2}>
                                    השם שיופיע באפליקציה ובמתכונים שלך
                                </Text>
                            </Box>
                        </Stack>

                        {/* Preferences Section */}
                        <Stack gap={6}>
                             <HStack gap={3}>
                                <Scale size={20} color="#f97316" />
                                <Heading size="md">העדפות מדידה</Heading>
                            </HStack>
                            
                             <Box maxW="md">
                                <Text mb={2} fontWeight="medium" fontSize="sm" color="gray.700">שיטת מדידה מועדפת (בקרוב)</Text>
                                <Box position="relative">
                                    <select
                                        value={preferredSystem}
                                        onChange={(e) => setPreferredSystem(e.target.value)}
                                        style={{
                                            width: "100%",
                                            padding: "12px",
                                            borderRadius: "12px",
                                            backgroundColor: "#f9fafb",
                                            border: "none",
                                            outline: "none",
                                            fontSize: "1rem"
                                        }}
                                        disabled
                                    >
                                        <option value="metric">מטרית (גרמים, מ"ל)</option>
                                        <option value="imperial">אימפריאלית (אונקיות, פאונד)</option>
                                    </select>
                                </Box>
                             </Box>

                             <Box maxW="md">
                                <Text mb={2} fontWeight="medium" fontSize="sm" color="gray.700">שפה (בקרוב)</Text>
                                <Box position="relative">
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        style={{
                                            width: "100%",
                                            padding: "12px",
                                            borderRadius: "12px",
                                            backgroundColor: "#f9fafb",
                                            border: "none",
                                            outline: "none",
                                            fontSize: "1rem"
                                        }}
                                        disabled
                                    >
                                        <option value="he">עברית</option>
                                        <option value="en">English</option>
                                    </select>
                                </Box>
                             </Box>
                        </Stack>

                    </Stack>
                </Card.Body>

                <Card.Footer bg="gray.50" p={6} borderTopWidth="1px" borderColor="gray.100" justifyContent="flex-end">
                     <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        size="xl"
                        colorPalette="orange"
                        bg="orange.500"
                        _hover={{ bg: "orange.600" }}
                        px={8}
                        borderRadius="xl"
                        shadow="md"
                        color="white"
                    >
                        {isLoading ? (
                        <Spinner size="sm" color="white" />
                        ) : isSaved ? (
                        <>
                            <Check size={18} style={{ marginLeft: "8px" }} />
                            נשמר!
                        </>
                        ) : (
                        <>
                            <Save size={18} style={{ marginLeft: "8px" }} />
                            שמור שינויים
                        </>
                        )}
                    </Button>
                </Card.Footer>
            </Card.Root>
        </Container>
    </Box>
  );
}
