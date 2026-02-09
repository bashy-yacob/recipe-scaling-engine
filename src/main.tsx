import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react';
import { router } from './router';
import { Toaster } from './components/ui/toaster';
import './styles/globals.css';

const system = createSystem(defaultConfig);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider value={system}>
      <RouterProvider router={router} />
      <Toaster />
    </ChakraProvider>
  </React.StrictMode>,
);
