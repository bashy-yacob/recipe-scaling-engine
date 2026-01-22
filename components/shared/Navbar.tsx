'use client';

import {
  Box,
  Container,
  HStack,
  Text,
  Button,
  Circle,
  IconButton,
} from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { ChefHat, Plus, BookOpen, Layout, Home, Menu, LogIn, LogOut, User, Settings } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

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
          <Link href="/" passHref>
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
            <NavLink href="/" active={pathname === '/'} icon={Home}>דף הבית</NavLink>
            <NavLink href="/dashboard/recipes" active={pathname?.includes('/recipes')} icon={BookOpen}>המתכונים שלי</NavLink>
            {session && <NavLink href="/settings" active={pathname === '/settings'} icon={Settings}>הגדרות</NavLink>}
            <NavLink href="/demo" active={pathname === '/demo'} icon={Layout}>UI Kit</NavLink>
          </HStack>

          {/* כפתור פעולה */}
          <HStack gap={3}>
            {/* כפתורי Auth */}
            {isLoading ? (
              <Box w="80px" />
            ) : session ? (
              <>
                <HStack gap={2} display={{ base: 'none', sm: 'flex' }}>
                  <Circle bg="orange.100" p={2}>
                    <User size={16} color="#ea580c" />
                  </Circle>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    {session.user?.name || session.user?.email?.split('@')[0]}
                  </Text>
                </HStack>
                <Button
                  variant="ghost"
                  size="sm"
                  color="gray.500"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  _hover={{ bg: 'red.50', color: 'red.500' }}
                >
                  <LogOut size={18} />
                  <Text display={{ base: 'none', md: 'block' }} mr={1}>יציאה</Text>
                </Button>
              </>
            ) : (
              <Button
                asChild
                variant="outline"
                size="sm"
                borderRadius="xl"
                borderColor="orange.200"
                color="orange.600"
                _hover={{ bg: 'orange.50' }}
              >
                <Link href="/auth/login">
                  <LogIn size={16} style={{ marginLeft: '6px' }} />
                  <Text fontWeight="bold" fontSize="sm">התחבר</Text>
                </Link>
              </Button>
            )}

            {session && (
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
                <Link href="/dashboard/recipes/new">
                  <Plus size={18} style={{ marginLeft: '6px' }} />
                  <Text fontWeight="bold" fontSize="sm">חדש</Text>
                </Link>
              </Button>
            )}

            {/* כפתור תפריט לנייד (יופיע רק במסכים קטנים) */}
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
function NavLink({ href, children, active, icon: Icon }: any) {
  return (
    <Link href={href} passHref>
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
          bg: active ? 'orange.50' : 'gray.50',
          color: active ? 'orange.600' : 'gray.800' 
        }}
        cursor="pointer"
      >
        <Icon size={18} />
        <Text>{children}</Text>
      </HStack>
    </Link>
  );
}
