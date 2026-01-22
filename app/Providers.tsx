'use client';

import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { Toaster } from '@/components/ui/toaster';

const system = createSystem(defaultConfig);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ChakraProvider value={system}>
        {children}
        <Toaster />
      </ChakraProvider>
    </SessionProvider>
  );
}
