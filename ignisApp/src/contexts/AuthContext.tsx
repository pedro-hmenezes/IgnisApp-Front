// src/contexts/AuthContext.tsx (agora apenas o hook)
import { useContext } from 'react';
import { AuthContext } from './auth-context.ts';
import type { AuthContextType } from './auth-types.ts';
export type { AuthContextType, UserProfile } from './auth-types.ts';

// Hook useAuth: provê o acesso ao contexto de autenticação
export const useAuth = (): AuthContextType => useContext(AuthContext);
