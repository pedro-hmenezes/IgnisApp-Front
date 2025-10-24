// src/contexts/AuthContext.tsx
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig'; // Import apiClient para o interceptor futuro

// Tipos (UserProfile, AuthContextType) - Sem mudança
type UserProfile = 'op1' | 'op2' | 'chefe' | 'admin' | null;
export interface AuthContextType { // Exportar para o hook useAuth
  isAuthenticated: boolean;
  userProfile: UserProfile;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

// Chave para salvar o token no localStorage
const TOKEN_KEY = 'ignis_auth_token';
const PROFILE_KEY = 'ignis_user_profile'; // Salvar perfil também é útil

// Contexto (valor padrão completo para satisfazer o tipo)
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userProfile: null,
  login: async () => false,
  logout: () => {},
  isLoading: true,
});

// Provedor
interface AuthProviderProps { children: ReactNode; }
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Começa true
  const navigate = useNavigate();

  // --- useEffect ATUALIZADO para verificar token no localStorage ---
  useEffect(() => {
    console.log("AuthProvider: Verificando token no localStorage...");
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedProfile = localStorage.getItem(PROFILE_KEY) as UserProfile; // Pega perfil salvo

    if (storedToken && storedProfile) {
      console.log("AuthProvider: Token encontrado. Simulando validação...");
      // NO FUTURO: Aqui você faria uma chamada API rápida (ex: /api/auth/verify)
      // para garantir que o token ainda é válido no backend.
      // Se for válido:
      setIsAuthenticated(true);
      setUserProfile(storedProfile);
      console.log(`AuthProvider: Sessão restaurada para perfil ${storedProfile}.`);
      // Configurar Axios para usar o token (ver axiosConfig.ts)
      try {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (e) {
        // Se por algum motivo apiClient não estiver disponível, apenas ignore
        console.debug('AuthProvider: não foi possível setar header no apiClient', e);
      }
    } else {
      console.log("AuthProvider: Nenhum token válido encontrado.");
    }
    setIsLoading(false); // Finaliza a verificação inicial
  }, []); // Roda apenas na montagem inicial

  // --- Função de Login ATUALIZADA (salva token/perfil) ---
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // REMOVA a simulação daqui quando integrar a API
    // A chamada API real virá aqui:
    // try {
    //   const response = await apiClient.post('/auth/login', { username, password });
    //   const { token, user } = response.data; // Exemplo de resposta da API
    //   localStorage.setItem(TOKEN_KEY, token);
    //   localStorage.setItem(PROFILE_KEY, user.profile); // Salva o perfil
    //   setIsAuthenticated(true);
    //   setUserProfile(user.profile);
    //   console.log(`AuthContext: Login via API bem-sucedido como ${user.profile}`);
    //   setIsLoading(false);
    //   return true;
    // } catch (error) {
    //   console.error('AuthContext: Falha no login via API', error);
    //   setIsLoading(false);
    //   return false;
    // }

    // --- SIMULAÇÃO (mantida por enquanto) ---
    console.log('AuthContext: Simulando login com:', { username });
    await new Promise(resolve => setTimeout(resolve, 500));
    let loggedIn = false;
    let profile: UserProfile = null;
    let mockToken = ''; // Simular um token

    if (username === 'admin' && password === 'admin') { loggedIn = true; profile = 'admin'; mockToken = 'fake_admin_token'; }
    else if (username === 'op1' && password === 'op1') { loggedIn = true; profile = 'op1'; mockToken = 'fake_op1_token'; }
    else if (username === 'op2' && password === 'op2') { loggedIn = true; profile = 'op2'; mockToken = 'fake_op2_token'; }
    else if (username === 'chefe' && password === 'chefe') { loggedIn = true; profile = 'chefe'; mockToken = 'fake_chefe_token'; }

    if (loggedIn && profile) {
      localStorage.setItem(TOKEN_KEY, mockToken); // SALVA O TOKEN SIMULADO
      localStorage.setItem(PROFILE_KEY, profile); // SALVA O PERFIL SIMULADO
      setIsAuthenticated(true);
      setUserProfile(profile);
      console.log(`AuthContext: Login SIMULADO bem-sucedido como ${profile}. Token salvo.`);
      setIsLoading(false);
      return true;
    } else {
      localStorage.removeItem(TOKEN_KEY); // Garante que não haja token antigo
      localStorage.removeItem(PROFILE_KEY);
      console.log('AuthContext: Falha no login SIMULADO');
      setIsLoading(false);
      return false;
    }
    // --- FIM DA SIMULAÇÃO ---
  };

  // --- Função de Logout ATUALIZADA (remove token/perfil) ---
  const logout = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    localStorage.removeItem(TOKEN_KEY);   // REMOVE O TOKEN
    localStorage.removeItem(PROFILE_KEY); // REMOVE O PERFIL
    // Opcional: Chamar API /api/auth/logout para invalidar token no backend
    console.log('AuthContext: Logout realizado. Token removido.');
    navigate('/login');
  };

  // Valor do contexto (sem mudança)
  const value = { isAuthenticated, userProfile, login, logout, isLoading, };

  // Provedor (sem mudança na renderização)
  return (
    <AuthContext.Provider value={value}>
      {!isLoading ? children : <div>Carregando autenticação...</div>}
    </AuthContext.Provider>
  );
};

// Hook useAuth (mantido aqui conforme sua decisão)
export const useAuth = (): AuthContextType => { // Adicionado tipo de retorno
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};