import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { AuthContext } from './auth-context';
import type { AuthContextType, UserProfile } from './auth-types';

// Chaves localStorage (uso interno apenas)
const TOKEN_KEY = 'ignis_auth_token';
const PROFILE_KEY = 'ignis_user_profile';

interface AuthProviderProps { children: ReactNode }

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Estado inicial forçado para 'admin'
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<UserProfile>('admin');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Login simulado: sempre sucesso como admin
  const login: AuthContextType['login'] = async (_username, _password) => {
    void _username; // evita aviso de variável não utilizada
    void _password;
    console.log('AuthContext: Tentativa de login (sempre sucesso como admin - DESATIVADO)');
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 100));

    localStorage.setItem(TOKEN_KEY, 'fake_admin_token_forced');
    localStorage.setItem(PROFILE_KEY, 'admin');
    apiClient.defaults.headers.common['Authorization'] = `Bearer fake_admin_token_forced`;
    setIsAuthenticated(true);
    setUserProfile('admin');

    setIsLoading(false);
    console.log('AuthContext: Estado forçado para admin.');
    return true;
  };

  // Logout funcional com redirecionamento
  const logout = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(PROFILE_KEY);
    delete apiClient.defaults.headers.common['Authorization'];
    console.log('AuthContext: Logout realizado. Token removido.');
    navigate('/login');
  };

  const value: AuthContextType = {
    isAuthenticated,
    userProfile,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
