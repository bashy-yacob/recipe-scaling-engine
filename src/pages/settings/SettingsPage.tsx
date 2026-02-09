// src/pages/settings/SettingsPage.tsx

import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Text,
  HStack,
  Card,
  Stack,
  Separator,
} from '@chakra-ui/react';
import { Settings, User, Scale, Save, Check } from 'lucide-react';
import { toaster } from '@/components/ui/toaster';

export function SettingsPage() {
  
  const [name, setName] = useState('משתמש');
  const [preferredSystem, setPreferredSystem] = useState('metric');
  const [language, setLanguage] = useState('he');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    setIsSaved(false);

    try {
      // TODO: Implement actual settings save
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsSaved(true);
      toaster.create({
        title: 'ההגדרות נשמרו בהצלחה!',
        type: 'success',
      });

      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      toaster.create({
        title: 'שגיאה בשמירת ההגדרות',
        type: 'error',
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
                    _focus={{ bg: 'white', ring: 2, ringColor: 'orange.500' }}
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
                  <Text mb={2} fontWeight="medium" fontSize="sm" color="gray.700">מערכת מידות</Text>
                  <HStack gap={3}>
                    <Button
                      flex={1}
                      variant={preferredSystem === 'metric' ? 'solid' : 'outline'}
                      colorPalette={preferredSystem === 'metric' ? 'orange' : 'gray'}
                      onClick={() => setPreferredSystem('metric')}
                      borderRadius="xl"
                    >
                      מטרי (גרם, מ"ל)
                    </Button>
                    <Button
                      flex={1}
                      variant={preferredSystem === 'imperial' ? 'solid' : 'outline'}
                      colorPalette={preferredSystem === 'imperial' ? 'orange' : 'gray'}
                      onClick={() => setPreferredSystem('imperial')}
                      borderRadius="xl"
                    >
                      אימפריאלי (cups, oz)
                    </Button>
                  </HStack>
                </Box>

                <Box maxW="md">
                  <Text mb={2} fontWeight="medium" fontSize="sm" color="gray.700">שפה</Text>
                  <HStack gap={3}>
                    <Button
                      flex={1}
                      variant={language === 'he' ? 'solid' : 'outline'}
                      colorPalette={language === 'he' ? 'orange' : 'gray'}
                      onClick={() => setLanguage('he')}
                      borderRadius="xl"
                    >
                      עברית
                    </Button>
                    <Button
                      flex={1}
                      variant={language === 'en' ? 'solid' : 'outline'}
                      colorPalette={language === 'en' ? 'orange' : 'gray'}
                      onClick={() => setLanguage('en')}
                      borderRadius="xl"
                    >
                      English
                    </Button>
                  </HStack>
                </Box>
              </Stack>

              {/* Save Button */}
              <Box>
                <Button
                  bg={isSaved ? 'green.500' : 'orange.500'}
                  color="white"
                  size="lg"
                  borderRadius="xl"
                  px={8}
                  onClick={handleSave}
                  loading={isLoading}
                  loadingText="שומר..."
                  _hover={{ bg: isSaved ? 'green.600' : 'orange.600' }}
                >
                  {isSaved ? (
                    <>
                      <Check size={20} style={{ marginLeft: '8px' }} />
                      נשמר!
                    </>
                  ) : (
                    <>
                      <Save size={20} style={{ marginLeft: '8px' }} />
                      שמור שינויים
                    </>
                  )}
                </Button>
              </Box>
            </Stack>
          </Card.Body>
        </Card.Root>
      </Container>
    </Box>
  );
}
