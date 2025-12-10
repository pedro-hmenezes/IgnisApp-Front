import { createContext, useContext } from 'react';

// Tipos
export type UserProfile = 'op1' | 'op2' | 'chefe' | 'admin' | null;

export interface AuthContextType {
  isAuthenticated: boolean;
  userProfile: UserProfile;
  userId?: string;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

// Contexto com valores padrão
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: true,
  userProfile: 'admin',
  userId: undefined,
  login: async () => true,
  logout: () => {},
  isLoading: false,
});

// Hook useAuth: provê o acesso ao contexto de autenticação
export const useAuth = (): AuthContextType => useContext(AuthContext);
