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

  // === Função de Login REAL (chama API) ===
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    console.log('AuthContext: Tentando login via API com:', { username });
    try {
      // Ajuste o tipo de resposta esperado <...> conforme sua API REAL retorna
      const response = await apiClient.post<{ token: string; user: { profile: UserProfile } }>('/auth/login', { username, password });

      const { token, user } = response.data;

      // Verifica se recebeu token e perfil
      if (token && user?.profile) {
        localStorage.setItem(TOKEN_KEY, token);        // Salva token
        localStorage.setItem(PROFILE_KEY, user.profile); // Salva perfil
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Configura Axios para esta sessão
        setIsAuthenticated(true);
        setUserProfile(user.profile);
        console.log(`AuthContext: Login via API bem-sucedido como ${user.profile}. Token salvo.`);
        setIsLoading(false);
        return true; // Sucesso
      } else {
         // Se a API retornou 200 OK mas sem token/perfil, algo está errado
         throw new Error("Resposta inválida da API de login (token ou perfil ausente).");
      }

    } catch (error) {
      console.error('AuthContext: Falha no login via API', error);
      // Limpa qualquer token/perfil antigo em caso de erro
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(PROFILE_KEY);
      delete apiClient.defaults.headers.common['Authorization'];
      setIsAuthenticated(false); // Garante que não está autenticado
      setUserProfile(null);
      setIsLoading(false);
      return false; // Falha
    }
    /* // Simulação REMOVIDA/COMENTADA
    console.log('AuthContext: Simulando login...');
    await new Promise(resolve => setTimeout(resolve, 500));
    // ... lógica da simulação ...
    return true; // ou false
    */
  };
  // ===================================

  // --- Função de Logout (CORRETA, SEM MUDANÇA) ---
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

// O hook useAuth foi movido para src/contexts/AuthContext.tsx para evitar problemas de Fast Refresh