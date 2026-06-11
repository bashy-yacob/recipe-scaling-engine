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
import { motion } from 'framer-motion';
import { Settings, User, Scale, Save, Check } from 'lucide-react';
import { toaster } from '@/components/ui/toaster';

const MotionBox = motion.create(Box);

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
    <Box minH="100vh" bg="bg.page" dir="rtl" w="100%">
      {/* Header Section */}
      <Box bg="bg.surface" borderBottom="1px solid" borderColor="border.muted" w="100%">
        <Container maxW="4xl" mx="auto" py={6} px={4}>
          <MotionBox initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <HStack gap={4} align="center">
              <Box bg="bg.brand.subtle" p={3} borderRadius="lg">
                <Settings size={24} color="var(--chakra-colors-brand-500)" />
              </Box>
              <Stack gap={0.5}>
                <Heading size="xl" fontWeight="bold" color="fg.heading">
                  הגדרות
                </Heading>
                <Text color="fg.muted" fontSize="sm">
                  ניהול פרופיל והעדפות אישיות
                </Text>
              </Stack>
            </HStack>
          </MotionBox>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="4xl" mx="auto" py={8} px={4}>
        <Card.Root variant="outline" borderColor="border.default" bg="bg.surface" borderRadius="xl">
          <Card.Body p={{ base: 5, md: 8 }}>
            <Stack gap={8} separator={<Separator borderColor="border.muted" />}>
              
              {/* Profile Section */}
              <Stack gap={5}>
                <HStack gap={2}>
                  <User size={18} color="var(--chakra-colors-brand-500)" />
                  <Heading size="sm" color="fg.heading">פרטים אישיים</Heading>
                </HStack>
                <Box maxW="md">
                  <Text mb={1.5} fontWeight="medium" fontSize="sm" color="fg.default">שם מלא</Text>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="השם שלך"
                    borderRadius="lg"
                    borderColor="border.default"
                  />
                  <Text fontSize="xs" color="fg.subtle" mt={1.5}>
                    השם שיופיע באפליקציה ובמתכונים שלך
                  </Text>
                </Box>
              </Stack>

              {/* Preferences Section */}
              <Stack gap={5}>
                <HStack gap={2}>
                  <Scale size={18} color="var(--chakra-colors-brand-500)" />
                  <Heading size="sm" color="fg.heading">העדפות מדידה</Heading>
                </HStack>
                
                <Box maxW="md">
                  <Text mb={1.5} fontWeight="medium" fontSize="sm" color="fg.default">מערכת מידות</Text>
                  <HStack gap={2}>
                    <Button
                      flex={1}
                      variant={preferredSystem === 'metric' ? 'solid' : 'outline'}
                      bg={preferredSystem === 'metric' ? 'btn.primary.bg' : undefined}
                      color={preferredSystem === 'metric' ? 'btn.primary.fg' : 'fg.default'}
                      borderColor={preferredSystem !== 'metric' ? 'border.default' : undefined}
                      onClick={() => setPreferredSystem('metric')}
                      borderRadius="lg"
                      size="sm"
                    >
                      מטרי (גרם, מ"ל)
                    </Button>
                    <Button
                      flex={1}
                      variant={preferredSystem === 'imperial' ? 'solid' : 'outline'}
                      bg={preferredSystem === 'imperial' ? 'btn.primary.bg' : undefined}
                      color={preferredSystem === 'imperial' ? 'btn.primary.fg' : 'fg.default'}
                      borderColor={preferredSystem !== 'imperial' ? 'border.default' : undefined}
                      onClick={() => setPreferredSystem('imperial')}
                      borderRadius="lg"
                      size="sm"
                    >
                      אימפריאלי (cups, oz)
                    </Button>
                  </HStack>
                </Box>

                <Box maxW="md">
                  <Text mb={1.5} fontWeight="medium" fontSize="sm" color="fg.default">שפה</Text>
                  <HStack gap={2}>
                    <Button
                      flex={1}
                      variant={language === 'he' ? 'solid' : 'outline'}
                      bg={language === 'he' ? 'btn.primary.bg' : undefined}
                      color={language === 'he' ? 'btn.primary.fg' : 'fg.default'}
                      borderColor={language !== 'he' ? 'border.default' : undefined}
                      onClick={() => setLanguage('he')}
                      borderRadius="lg"
                      size="sm"
                    >
                      עברית
                    </Button>
                    <Button
                      flex={1}
                      variant={language === 'en' ? 'solid' : 'outline'}
                      bg={language === 'en' ? 'btn.primary.bg' : undefined}
                      color={language === 'en' ? 'btn.primary.fg' : 'fg.default'}
                      borderColor={language !== 'en' ? 'border.default' : undefined}
                      onClick={() => setLanguage('en')}
                      borderRadius="lg"
                      size="sm"
                    >
                      English
                    </Button>
                  </HStack>
                </Box>
              </Stack>

              {/* Save Button */}
              <Box>
                <Button
                  bg={isSaved ? 'green.500' : 'btn.primary.bg'}
                  color="btn.primary.fg"
                  borderRadius="lg"
                  px={6}
                  onClick={handleSave}
                  loading={isLoading}
                  loadingText="שומר..."
                  _hover={{ bg: isSaved ? 'green.600' : 'btn.primary.hover' }}
                >
                  {isSaved ? (
                    <>
                      <Check size={18} />
                      <Text ms={1}>נשמר!</Text>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <Text ms={1}>שמור שינויים</Text>
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
