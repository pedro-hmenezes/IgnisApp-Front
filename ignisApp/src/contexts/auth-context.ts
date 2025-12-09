import { createContext } from 'react';
import type { AuthContextType } from './auth-types';

// Contexto com valores padrão (temporários) para desenv
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: true,
  userProfile: 'admin',
  userId: undefined,
  login: async () => true,
  logout: () => {},
  isLoading: false,
});
