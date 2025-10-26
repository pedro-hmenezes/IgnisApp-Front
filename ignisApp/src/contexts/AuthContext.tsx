// src/contexts/AuthContext.tsx
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

// Tipos
type UserProfile = 'op1' | 'op2' | 'chefe' | 'admin' | null;
export interface AuthContextType {
  isAuthenticated: boolean;
  userProfile: UserProfile;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

// Chaves consistentes para localStorage
const TOKEN_KEY = 'ignis_auth_token';
const PROFILE_KEY = 'ignis_user_profile';

// Contexto
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userProfile: null,
  login: async () => false,
  logout: () => {},
  isLoading: true,
});

// Provedor
interface AuthProviderProps { children: ReactNode; }
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // useEffect para verificar token no localStorage
  useEffect(() => {
    console.log("AuthProvider: Verificando token no localStorage...");
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedProfile = localStorage.getItem(PROFILE_KEY) as UserProfile;

    if (storedToken && storedProfile) {
      console.log("AuthProvider: Token encontrado. Restaurando sessão...");
      // Define o token no header padrão do Axios para chamadas futuras nesta sessão
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      setIsAuthenticated(true);
      setUserProfile(storedProfile);
      console.log(`AuthProvider: Sessão restaurada para perfil ${storedProfile}.`);
    } else {
      console.log("AuthProvider: Nenhum token válido encontrado.");
      // Garante que o header do Axios esteja limpo se não houver token
      delete apiClient.defaults.headers.common['Authorization'];
    }
    setIsLoading(false);
  }, []);

  // Função de Login (Pronta para API real)
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    console.log('AuthContext: Tentando login via API com:', { username });
    try {
      // --- CHAMADA API REAL ---
      const response = await apiClient.post<{ token: string; user: { profile: UserProfile } }>('/auth/login', { username, password }); // Ajuste a URL e o tipo de resposta esperado
      
      const { token, user } = response.data; 

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
         throw new Error("Resposta inválida da API de login (token ou perfil ausente).");
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

  // Função de Logout (Pronta)
  const logout = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    localStorage.removeItem(TOKEN_KEY);   
    localStorage.removeItem(PROFILE_KEY); 
    delete apiClient.defaults.headers.common['Authorization']; // Limpa header do Axios
    console.log('AuthContext: Logout realizado. Token removido.');
    navigate('/login');
  };

  // Valor do contexto
  const value = { isAuthenticated, userProfile, login, logout, isLoading, };

  // Provedor
  return (
    <AuthContext.Provider value={value}>
      {!isLoading ? children : <div>Carregando autenticação...</div>}
    </AuthContext.Provider>
  );
};

// Hook useAuth (mantido aqui)
export const useAuth = (): AuthContextType => { 
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};