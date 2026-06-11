// src/components/ui/color-mode-toggle.tsx

import { IconButton } from '@chakra-ui/react';
import { useColorMode } from '@/hooks/useColorMode';
import { Sun, Moon } from 'lucide-react';

export function ColorModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      variant="ghost"
      aria-label="החלף מצב תצוגה"
      onClick={toggleColorMode}
      color="fg.muted"
      _hover={{ bg: 'bg.muted', color: 'fg.default' }}
      size="sm"
      borderRadius="lg"
    >
      {colorMode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </IconButton>
  );
}
