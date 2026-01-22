'use client';

import {
  Box,
  Container,
  HStack,
  Text,
  Button,
  Circle,
  IconButton,
  Stack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChefHat, Plus, BookOpen, Layout, Home, Menu } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

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
            <NavLink href="/demo" active={pathname === '/demo'} icon={Layout}>UI Kit</NavLink>
          </HStack>

          {/* כפתור פעולה */}
          <HStack gap={3}>
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
