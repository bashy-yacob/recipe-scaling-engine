import { Outlet } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { Navbar } from './components/shared/Navbar';
import { Footer } from './components/shared/Footer';

/**
 * Root App Layout
 * Contains the main layout structure with Navbar, content area, and Footer
 */
export function App() {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Box as="main" flex="1">
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
