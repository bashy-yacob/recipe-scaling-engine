// src/components/shared/Navbar.tsx

import {
  Box,
  Container,
  HStack,
  Text,
  Button,
  Circle,
  IconButton,
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { ChefHat, Plus, BookOpen, Layout, Home, Menu, LogIn, Settings } from 'lucide-react';
import { ROUTES } from '@/router';

export function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;

  // TODO: Replace with actual auth state management
  const isAuthenticated = true; // For demo purposes

  return (
    <Box
      as="nav"
      position="sticky"
      top="0"
      zIndex="1000"
      bg="white/80"
      backdropFilter="blur(10px)"
      borderBottom="1px"
      borderColor="gray.100"
      dir="rtl"
    >
      <Container maxW="5xl" mx="auto" px={6}>
        <HStack h="72px" justify="space-between" gap={8}>
          
          {/* לוגו */}
          <Link to={ROUTES.HOME}>
            <HStack gap={3} cursor="pointer" _hover={{ opacity: 0.8 }} transition="opacity 0.2s">
              <Circle bg="orange.500" p={2} boxShadow="0 4px 12px rgba(249, 115, 22, 0.3)">
                <ChefHat size={22} color="white" />
              </Circle>
              <Text fontSize="lg" fontWeight="black" letterSpacing="tight" display={{ base: 'none', sm: 'block' }}>
                Recipe <Text as="span" color="orange.500">Scaling</Text>
              </Text>
            </HStack>
          </Link>

          {/* קישורי ניווט - Desktop */}
          <HStack gap={1} display={{ base: 'none', md: 'flex' }} flex={1} justify="center">
            <NavLink href={ROUTES.HOME} active={pathname === '/'} icon={Home}>דף הבית</NavLink>
            <NavLink href={ROUTES.RECIPES} active={pathname.includes('/recipes')} icon={BookOpen}>המתכונים שלי</NavLink>
            {isAuthenticated && <NavLink href={ROUTES.SETTINGS} active={pathname === '/settings'} icon={Settings}>הגדרות</NavLink>}
            <NavLink href={ROUTES.DEMO} active={pathname === '/demo'} icon={Layout}>UI Kit</NavLink>
          </HStack>

          {/* כפתור פעולה */}
          <HStack gap={3}>
            {/* כפתורי Auth */}
            {!isAuthenticated ? (
              <Button
                asChild
                variant="outline"
                size="sm"
                borderRadius="xl"
                borderColor="orange.200"
                color="orange.600"
                _hover={{ bg: 'orange.50' }}
              >
                <Link to={ROUTES.LOGIN}>
                  <LogIn size={16} style={{ marginLeft: '6px' }} />
                  <Text fontWeight="bold" fontSize="sm">התחבר</Text>
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                bg="orange.500"
                color="white"
                size="md"
                borderRadius="xl"
                px={5}
                boxShadow="0 4px 12px rgba(249, 115, 22, 0.2)"
                _hover={{ bg: 'orange.600', transform: 'translateY(-1px)' }}
                _active={{ transform: 'translateY(0)' }}
                transition="all 0.2s"
              >
                <Link to={ROUTES.RECIPE_NEW}>
                  <Plus size={18} style={{ marginLeft: '6px' }} />
                  <Text fontWeight="bold" fontSize="sm">חדש</Text>
                </Link>
              </Button>
            )}

            {/* כפתור תפריט לנייד */}
            <IconButton
              variant="ghost"
              display={{ base: 'flex', md: 'none' }}
              aria-label="תפריט"
              color="gray.600"
            >
              <Menu size={24} />
            </IconButton>
          </HStack>

        </HStack>
      </Container>
    </Box>
  );
}

// קומפוננטת עזר לקישור בנאב-בר
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active: boolean;
  icon: React.ComponentType<{ size: number }>;
}

function NavLink({ href, children, active, icon: Icon }: NavLinkProps) {
  return (
    <Link to={href}>
      <HStack
        px={4}
        py={2}
        borderRadius="xl"
        color={active ? 'orange.600' : 'gray.500'}
        bg={active ? 'orange.50' : 'transparent'}
        fontWeight={active ? 'bold' : 'medium'}
        fontSize="sm"
        transition="all 0.2s"
        _hover={{ 
          bg: active ? 'orange.100' : 'gray.100',
          color: active ? 'orange.700' : 'gray.700',
        }}
      >
        <Icon size={18} />
        <Text>{children}</Text>
      </HStack>
    </Link>
  );
}
