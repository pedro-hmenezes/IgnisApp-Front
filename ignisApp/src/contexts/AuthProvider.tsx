import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { loginUser } from '../api/authService';
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

  // Mapeia valores diversos do backend para nossos perfis conhecidos
  const mapProfile = (raw?: string): UserProfile => {
    const v = (raw || '').toLowerCase().trim();
    if (!v) return 'admin';
    if (v.includes('admin')) return 'admin';
    if (v.includes('chefe') || v.includes('supervisor')) return 'chefe';
    if (v.includes('op2') || v.includes('campo')) return 'op2';
    if (v.includes('op1') || v.includes('central') || v.includes('operador')) return 'op1';
    return 'admin';
  };

  // === Função de Login REAL (chama API do backend) ===
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    console.log('AuthContext: Tentando login via API com:', { username });
    
    try {
      // Chama a API real de login
      const response = await loginUser(username, password);
      
      const { token, user } = response;
      
      if (token) {
        const profile = mapProfile(user?.perfil);
        // Salva token e perfil no localStorage
        localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(PROFILE_KEY, profile || 'admin');
        
        // Configura o header Authorization para todas as próximas requisições
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setIsAuthenticated(true);
        setUserProfile(profile);
        console.log(`AuthContext: Login bem-sucedido. Perfil mapeado: ${profile}.`);
        setIsLoading(false);
        return true;
      } else {
        throw new Error('Resposta inválida da API de login (token ou usuário ausente).');
      }
    } catch (error: unknown) {
      console.error('AuthContext: Falha no login via API', error);
      
      // Limpa qualquer token/perfil antigo em caso de erro
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