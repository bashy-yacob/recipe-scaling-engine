// src/hooks/useAuth.ts

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import {
  User,
  LoginCredentials,
  RegisterData,
  UpdatePreferencesData,
  login as apiLogin,
  register as apiRegister,
  getCurrentUser,
  updatePreferences as apiUpdatePreferences,
  logout as apiLogout,
  getStoredToken,
} from '@/lib/api/auth';

// ============ Types ============

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updatePreferences: (data: UpdatePreferencesData) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
}

// ============ Context ============

const AuthContext = createContext<AuthContextType | null>(null);

// ============ Provider ============

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getStoredToken();
      if (token) {
        const response = await getCurrentUser();
        if (response.success && response.data) {
          setState({
            user: response.data,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          // Token invalid - clear it
          apiLogout();
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  // Login
  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await apiLogin(credentials);
    if (response.success && response.data) {
      setState({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true };
    }
    return { success: false, error: response.error };
  }, []);

  // Register
  const register = useCallback(async (data: RegisterData) => {
    const response = await apiRegister(data);
    if (response.success && response.data) {
      setState({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true };
    }
    return { success: false, error: response.error };
  }, []);

  // Logout
  const logout = useCallback(() => {
    apiLogout();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  // Update preferences
  const updatePreferences = useCallback(async (data: UpdatePreferencesData) => {
    const response = await apiUpdatePreferences(data);
    if (response.success && response.data) {
      setState(prev => ({
        ...prev,
        user: response.data!,
      }));
      return { success: true };
    }
    return { success: false, error: response.error };
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    const response = await getCurrentUser();
    if (response.success && response.data) {
      setState(prev => ({
        ...prev,
        user: response.data!,
      }));
    }
  }, []);

  // Memoized context value
  const value = useMemo<AuthContextType>(() => ({
    ...state,
    login,
    register,
    logout,
    updatePreferences,
    refreshUser,
  }), [state, login, register, logout, updatePreferences, refreshUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ============ Hook ============

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
