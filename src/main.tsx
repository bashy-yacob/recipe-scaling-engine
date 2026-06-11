import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { system } from './theme';
import { router } from './router';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './hooks/useAuth';
import { ColorModeProvider } from './hooks/useColorMode';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider value={system}>
      <ColorModeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster />
        </AuthProvider>
      </ColorModeProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
