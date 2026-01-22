"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Box, Button, Text, VStack, Heading, Card } from "@chakra-ui/react";
import { AlertTriangle, Home } from "lucide-react";

const errorMessages: Record<string, string> = {
  Configuration: "יש בעיה בהגדרות השרת",
  AccessDenied: "הגישה נדחתה",
  Verification: "קישור האימות פג תוקף",
  Default: "שגיאה בהתחברות",
  CredentialsSignin: "אימייל או סיסמה שגויים",
  OAuthSignin: "שגיאה בהתחברות עם ספק חיצוני",
  OAuthCallback: "שגיאה בתהליך ההתחברות",
  OAuthCreateAccount: "לא ניתן ליצור חשבון",
  EmailCreateAccount: "לא ניתן ליצור חשבון עם אימייל זה",
  Callback: "שגיאה בתהליך ההתחברות",
  OAuthAccountNotLinked: "האימייל כבר מחובר לחשבון אחר",
  EmailSignin: "שגיאה בשליחת אימייל",
  SessionRequired: "נדרשת התחברות",
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Default";
  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <Box minH="calc(100vh - 200px)" display="flex" alignItems="center" justifyContent="center" p={4}>
      <Card.Root maxW="md" w="full" p={8}>
        <VStack gap={6}>
          <Box color="red.500">
            <AlertTriangle size={64} />
          </Box>
          
          <VStack gap={2}>
            <Heading size="xl" color="red.600">שגיאה</Heading>
            <Text color="gray.600" textAlign="center">{errorMessage}</Text>
          </VStack>

          <VStack gap={3} w="full">
            <Button asChild colorPalette="teal" w="full">
              <Link href="/auth/login">נסה שוב</Link>
            </Button>
            <Button asChild variant="outline" w="full">
              <Link href="/">
                <Home size={18} />
                חזור לדף הבית
              </Link>
            </Button>
          </VStack>
        </VStack>
      </Card.Root>
    </Box>
  );
}
