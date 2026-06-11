// src/components/shared/Navbar.tsx

import { useState } from 'react';
import {
  Box,
  Container,
  HStack,
  Text,
  Button,
  IconButton,
  Spinner,
  Stack,
  Separator,
} from '@chakra-ui/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChefHat, Plus, BookOpen, Home, Menu, LogIn, Settings, LogOut, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES } from '@/router';
import { useAuth } from '@/hooks/useAuth';
import { ColorModeToggle } from '@/components/ui/color-mode-toggle';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { isAuthenticated, isLoading, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsMobileOpen(false);
    navigate(ROUTES.HOME);
  };

  const closeMobile = () => setIsMobileOpen(false);

  return (
    <>
      <Box
        as="nav"
        position="sticky"
        top="0"
        zIndex="1000"
        bg="bg.surface"
        borderBottom="1px solid"
        borderColor="border.muted"
        dir="rtl"
      >
        <Container maxW="5xl" mx="auto" px={6}>
          <HStack h="64px" justify="space-between" gap={8}>
            
            {/* לוגו */}
            <Link to={ROUTES.HOME}>
              <HStack gap={2.5} cursor="pointer" _hover={{ opacity: 0.8 }} transition="opacity 0.2s">
                <Box bg="brand.500" p={1.5} borderRadius="lg">
                  <ChefHat size={20} color="white" />
                </Box>
                <Text fontSize="md" fontWeight="extrabold" letterSpacing="tight" display={{ base: 'none', sm: 'block' }} color="fg.heading">
                  Recipe <Text as="span" color="fg.brand">Scaling</Text>
                </Text>
              </HStack>
            </Link>

            {/* קישורי ניווט - Desktop */}
            <HStack gap={1} display={{ base: 'none', md: 'flex' }} flex={1} justify="center">
              <NavLink href={ROUTES.HOME} active={pathname === '/'} icon={Home}>דף הבית</NavLink>
              <NavLink href={ROUTES.RECIPES} active={pathname.includes('/recipes')} icon={BookOpen}>המתכונים שלי</NavLink>
              {isAuthenticated && <NavLink href={ROUTES.SETTINGS} active={pathname === '/settings'} icon={Settings}>הגדרות</NavLink>}
            </HStack>

            {/* כפתורי פעולה */}
            <HStack gap={2}>
              <ColorModeToggle />
              
              {isLoading ? (
                <Spinner size="sm" color="fg.brand" />
              ) : !isAuthenticated ? (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  borderRadius="lg"
                  borderColor="border.default"
                  color="fg.default"
                  _hover={{ bg: 'bg.muted' }}
                  display={{ base: 'none', md: 'flex' }}
                >
                  <Link to={ROUTES.LOGIN}>
                    <LogIn size={16} />
                    <Text fontWeight="semibold" fontSize="sm" ms={1.5}>התחבר</Text>
                  </Link>
                </Button>
              ) : (
                <HStack gap={2} display={{ base: 'none', md: 'flex' }}>
                  {user?.name && (
                    <Text fontSize="sm" color="fg.muted">
                      שלום, {user.name}
                    </Text>
                  )}
                  <Button
                    asChild
                    bg="btn.primary.bg"
                    color="btn.primary.fg"
                    size="sm"
                    borderRadius="lg"
                    px={4}
                    _hover={{ bg: 'btn.primary.hover' }}
                    transition="all 0.2s"
                  >
                    <Link to={ROUTES.RECIPE_NEW}>
                      <Plus size={16} />
                      <Text fontWeight="semibold" fontSize="sm" ms={1.5}>חדש</Text>
                    </Link>
                  </Button>
                  <IconButton
                    variant="ghost"
                    aria-label="התנתק"
                    color="fg.muted"
                    _hover={{ bg: 'red.50', color: 'red.500' }}
                    onClick={handleLogout}
                    size="sm"
                  >
                    <LogOut size={18} />
                  </IconButton>
                </HStack>
              )}

              {/* כפתור תפריט לנייד */}
              <IconButton
                variant="ghost"
                display={{ base: 'flex', md: 'none' }}
                aria-label="תפריט"
                color="fg.default"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
              >
                {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
              </IconButton>
            </HStack>

          </HStack>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.3)',
                zIndex: 998,
              }}
              onClick={closeMobile}
            />
            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'fixed',
                top: '64px',
                left: 0,
                right: 0,
                zIndex: 999,
              }}
            >
              <Box bg="bg.surface" borderBottom="1px solid" borderColor="border.muted" shadow="lg" dir="rtl">
                <Container maxW="5xl" mx="auto" px={6} py={4}>
                  <Stack gap={1}>
                    <MobileNavLink href={ROUTES.HOME} active={pathname === '/'} onClick={closeMobile}>דף הבית</MobileNavLink>
                    <MobileNavLink href={ROUTES.RECIPES} active={pathname.includes('/recipes')} onClick={closeMobile}>המתכונים שלי</MobileNavLink>
                    {isAuthenticated && (
                      <MobileNavLink href={ROUTES.SETTINGS} active={pathname === '/settings'} onClick={closeMobile}>הגדרות</MobileNavLink>
                    )}
                    
                    <Separator my={2} borderColor="border.muted" />
                    
                    {!isAuthenticated ? (
                      <Link to={ROUTES.LOGIN} onClick={closeMobile}>
                        <HStack px={3} py={2.5} borderRadius="lg" _hover={{ bg: 'bg.muted' }}>
                          <LogIn size={18} />
                          <Text fontWeight="semibold">התחבר</Text>
                        </HStack>
                      </Link>
                    ) : (
                      <Stack gap={1}>
                        <Link to={ROUTES.RECIPE_NEW} onClick={closeMobile}>
                          <HStack px={3} py={2.5} borderRadius="lg" color="fg.brand" _hover={{ bg: 'bg.brand.subtle' }}>
                            <Plus size={18} />
                            <Text fontWeight="semibold">מתכון חדש</Text>
                          </HStack>
                        </Link>
                        <Box
                          as="button"
                          onClick={handleLogout}
                          w="full"
                          textAlign="start"
                        >
                          <HStack px={3} py={2.5} borderRadius="lg" color="red.500" _hover={{ bg: 'red.50' }}>
                            <LogOut size={18} />
                            <Text fontWeight="semibold">התנתק</Text>
                          </HStack>
                        </Box>
                      </Stack>
                    )}
                  </Stack>
                </Container>
              </Box>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// קישור Desktop
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
        px={3}
        py={2}
        borderRadius="lg"
        color={active ? 'fg.brand' : 'fg.muted'}
        bg={active ? 'bg.brand.subtle' : 'transparent'}
        fontWeight={active ? 'bold' : 'medium'}
        fontSize="sm"
        transition="all 0.2s"
        _hover={{ 
          bg: active ? 'bg.brand.subtle' : 'bg.muted',
          color: active ? 'fg.brand' : 'fg.default',
        }}
      >
        <Icon size={16} />
        <Text>{children}</Text>
      </HStack>
    </Link>
  );
}

// קישור Mobile
interface MobileNavLinkProps {
  href: string;
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

function MobileNavLink({ href, children, active, onClick }: MobileNavLinkProps) {
  return (
    <Link to={href} onClick={onClick}>
      <Box
        px={3}
        py={2.5}
        borderRadius="lg"
        color={active ? 'fg.brand' : 'fg.default'}
        bg={active ? 'bg.brand.subtle' : 'transparent'}
        fontWeight={active ? 'bold' : 'medium'}
        transition="all 0.15s"
        _hover={{ bg: 'bg.muted' }}
      >
        <Text>{children}</Text>
      </Box>
    </Link>
  );
}
