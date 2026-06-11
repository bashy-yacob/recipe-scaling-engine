// src/lib/api/auth.ts

import { apiFetch, ApiResponse } from './config';

// ============ Types ============

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  preferredSystem: 'metric' | 'imperial';
  language: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface UpdatePreferencesData {
  name?: string;
  preferredSystem?: 'metric' | 'imperial';
  language?: string;
}

// ============ Token Management ============

const TOKEN_KEY = 'auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ============ API Functions ============

/**
 * Login with email and password
 */
export async function login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
  const response = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  if (response.success && response.data?.token) {
    setStoredToken(response.data.token);
  }

  return response;
}

/**
 * Register new user
 */
export async function register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
  const response = await apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (response.success && response.data?.token) {
    setStoredToken(response.data.token);
  }

  return response;
}

/**
 * Get current user info
 */
export async function getCurrentUser(): Promise<ApiResponse<User>> {
  const token = getStoredToken();
  if (!token) {
    return { success: false, error: 'לא מחובר' };
  }

  return apiFetch<User>('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Update user preferences
 */
export async function updatePreferences(data: UpdatePreferencesData): Promise<ApiResponse<User>> {
  const token = getStoredToken();
  if (!token) {
    return { success: false, error: 'לא מחובר' };
  }

  return apiFetch<User>('/auth/me/preferences', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

/**
 * Logout - clear token
 */
export function logout(): void {
  removeStoredToken();
}
