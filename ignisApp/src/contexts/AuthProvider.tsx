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
  // === ESTADO INICIAL PADRÃO ===
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Começa true para verificação inicial
  // ============================
  const navigate = useNavigate();

  // === useEffect REATIVADO para verificar token no localStorage ===
  useEffect(() => {
    console.log("AuthProvider: Verificando token no localStorage...");
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedProfile = localStorage.getItem(PROFILE_KEY) as UserProfile;

    if (storedToken && storedProfile) {
      console.log("AuthProvider: Token encontrado. Restaurando sessão...");
      // Define o token no header padrão do Axios imediatamente
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      // Assume token válido por enquanto (idealmente, verificar com API /verify)
      setIsAuthenticated(true);
      setUserProfile(storedProfile);
      console.log(`AuthProvider: Sessão restaurada para perfil ${storedProfile}.`);
    } else {
      console.log("AuthProvider: Nenhum token válido encontrado.");
      delete apiClient.defaults.headers.common['Authorization'];
    }
    setIsLoading(false); // Finaliza a verificação inicial
  }, []);
  // =============================================================

  // === Função de Login REAL (chama API) ===
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    console.log('AuthContext: Tentando login via API com:', { username });
    try {
      // Ajuste o tipo de resposta esperado conforme sua API
      const response = await apiClient.post<{ token: string; user: { profile: UserProfile } }>('/auth/login', { username, password });

      const { token, user } = response.data;

      if (token && user?.profile) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(PROFILE_KEY, user.profile);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setIsAuthenticated(true);
        setUserProfile(user.profile);
        console.log(`AuthContext: Login via API bem-sucedido como ${user.profile}. Token salvo.`);
        setIsLoading(false);
        return true; // Sucesso
      } else {
         throw new Error("Resposta inválida da API de login.");
      }
    } catch (error) {
      console.error('AuthContext: Falha no login via API', error);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(PROFILE_KEY);
      delete apiClient.defaults.headers.common['Authorization'];
      setIsAuthenticated(false);
      setUserProfile(null);
      setIsLoading(false);
      return false; // Falha
    }
  };
  // ===================================

  // --- Função de Logout (sem mudança, já estava correta) ---
  const logout = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(PROFILE_KEY);
    delete apiClient.defaults.headers.common['Authorization'];
    console.log('AuthContext: Logout realizado. Token removido.');
    navigate('/login');
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