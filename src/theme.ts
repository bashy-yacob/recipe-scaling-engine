// src/theme.ts — Custom Design System

import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  globalCss: {
    body: {
      fontFamily: "'Assistant', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      bg: { base: 'gray.50', _dark: 'gray.950' },
      color: { base: 'gray.800', _dark: 'gray.100' },
    },
  },
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#fff7ed' },
          100: { value: '#ffedd5' },
          200: { value: '#fed7aa' },
          300: { value: '#fdba74' },
          400: { value: '#fb923c' },
          500: { value: '#f97316' },
          600: { value: '#ea580c' },
          700: { value: '#c2410c' },
          800: { value: '#9a3412' },
          900: { value: '#7c2d12' },
        },
        slate_blue: {
          50: { value: '#f0f2f8' },
          100: { value: '#dde1ef' },
          200: { value: '#bcc3df' },
          300: { value: '#9aa5cf' },
          400: { value: '#8291c3' },
          500: { value: '#6B7DB8' },
          600: { value: '#5a6aa3' },
          700: { value: '#4a578a' },
          800: { value: '#3d4872' },
          900: { value: '#333d5e' },
        },
      },
    },
    semanticTokens: {
      colors: {
        // Page backgrounds
        'bg.page': {
          value: { base: '{colors.gray.50}', _dark: '{colors.gray.950}' },
        },
        'bg.surface': {
          value: { base: '#ffffff', _dark: '{colors.gray.900}' },
        },
        'bg.muted': {
          value: { base: '{colors.gray.100}', _dark: '{colors.gray.800}' },
        },
        'bg.subtle': {
          value: { base: '{colors.gray.50}', _dark: '{colors.gray.800}' },
        },
        // Brand backgrounds
        'bg.brand.subtle': {
          value: { base: '{colors.brand.50}', _dark: '{colors.brand.900/30}' },
        },
        'bg.brand.muted': {
          value: { base: '{colors.brand.100}', _dark: '{colors.brand.800/30}' },
        },
        'bg.secondary.subtle': {
          value: { base: '{colors.slate_blue.50}', _dark: '{colors.slate_blue.900/30}' },
        },
        // Text colors
        'fg.heading': {
          value: { base: '{colors.gray.900}', _dark: '{colors.gray.50}' },
        },
        'fg.default': {
          value: { base: '{colors.gray.700}', _dark: '{colors.gray.200}' },
        },
        'fg.muted': {
          value: { base: '{colors.gray.500}', _dark: '{colors.gray.400}' },
        },
        'fg.subtle': {
          value: { base: '{colors.gray.400}', _dark: '{colors.gray.500}' },
        },
        // Brand text
        'fg.brand': {
          value: { base: '{colors.brand.600}', _dark: '{colors.brand.400}' },
        },
        'fg.secondary': {
          value: { base: '{colors.slate_blue.600}', _dark: '{colors.slate_blue.400}' },
        },
        // Borders
        'border.default': {
          value: { base: '{colors.gray.200}', _dark: '{colors.gray.700}' },
        },
        'border.muted': {
          value: { base: '{colors.gray.100}', _dark: '{colors.gray.800}' },
        },
        'border.brand': {
          value: { base: '{colors.brand.200}', _dark: '{colors.brand.700}' },
        },
        // Interactive
        'btn.primary.bg': {
          value: { base: '{colors.brand.500}', _dark: '{colors.brand.400}' },
        },
        'btn.primary.hover': {
          value: { base: '{colors.brand.600}', _dark: '{colors.brand.500}' },
        },
        'btn.primary.fg': {
          value: { base: '#ffffff', _dark: '{colors.gray.950}' },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
