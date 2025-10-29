// src/contexts/AuthProvider.tsx
import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { AuthContext } from './auth-context';
import type { AuthContextType, UserProfile } from './auth-types'; // Garanta que estes tipos estejam exportados

// Chaves localStorage
const TOKEN_KEY = 'ignis_auth_token';
const PROFILE_KEY = 'ignis_user_profile';

interface AuthProviderProps { children: ReactNode }

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Estado inicial (começa não autenticado, isLoading true para verificação)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Começa true
  const navigate = useNavigate();

  // useEffect para verificar token no localStorage (CORRETO, SEM MUDANÇA)
  useEffect(() => {
    console.log("AuthProvider: Verificando token no localStorage...");
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedProfile = localStorage.getItem(PROFILE_KEY) as UserProfile;

    if (storedToken && storedProfile) {
      console.log("AuthProvider: Token encontrado. Restaurando sessão...");
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      setIsAuthenticated(true);
      setUserProfile(storedProfile);
      console.log(`AuthProvider: Sessão restaurada para perfil ${storedProfile}.`);
    } else {
      console.log("AuthProvider: Nenhum token válido encontrado.");
      delete apiClient.defaults.headers.common['Authorization'];
    }
    setIsLoading(false);
  }, []);

  // === Função de Login LOCAL (credenciais fixas: admin/admin) ===
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    console.log('AuthContext: Tentando login local com:', { username });
    
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 300));

    // Verifica credenciais fixas
    if (username === 'admin' && password === 'admin') {
      const mockToken = 'mock-token-admin-' + Date.now();
      const profile: UserProfile = 'admin';
      
      localStorage.setItem(TOKEN_KEY, mockToken);
      localStorage.setItem(PROFILE_KEY, profile);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
      
      setIsAuthenticated(true);
      setUserProfile(profile);
      console.log('AuthContext: Login local bem-sucedido como admin.');
      setIsLoading(false);
      return true;
    } else {
      console.warn('AuthContext: Credenciais inválidas.');
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(PROFILE_KEY);
      delete apiClient.defaults.headers.common['Authorization'];
      setIsAuthenticated(false);
      setUserProfile(null);
      setIsLoading(false);
      return false;
    }
  };
  // ===================================

  // --- Função de Logout ---
  const logout = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(PROFILE_KEY);
    delete apiClient.defaults.headers.common['Authorization'];
    console.log('AuthContext: Logout realizado. Token removido.');
    navigate('/home');
  };

  // Valor do contexto
  const value: AuthContextType = { isAuthenticated, userProfile, login, logout, isLoading };

  // Provedor
  return (
    <AuthContext.Provider value={value}>
      {!isLoading ? children : <div>Carregando autenticação...</div>}
    </AuthContext.Provider>
  );
};

// O hook useAuth foi movido para src/contexts/AuthContext.tsx para evitar problemas de Fast Refresh