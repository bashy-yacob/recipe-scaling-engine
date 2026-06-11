// server/lib/validations/auth.ts
// Zod schemas for authentication validation

import { z } from 'zod';

// ============================================
// Auth validation schemas
// ============================================

export const registerSchema = z.object({
  email: z.string().email('כתובת אימייל לא תקינה'),
  password: z.string().min(6, 'הסיסמה חייבת להכיל לפחות 6 תווים'),
  name: z.string().min(1, 'שם חובה').optional(),
});

export const loginSchema = z.object({
  email: z.string().email('כתובת אימייל לא תקינה'),
  password: z.string().min(1, 'סיסמה חובה'),
});

export const updatePreferencesSchema = z.object({
  name: z.string().optional(),
  preferredSystem: z.enum(['metric', 'imperial']).optional(),
  language: z.enum(['he', 'en']).optional(),
});

// ============================================
// TypeScript types
// ============================================

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;
