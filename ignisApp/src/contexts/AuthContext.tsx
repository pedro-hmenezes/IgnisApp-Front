// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Definir os possíveis perfis de usuário
type UserProfile = 'op1' | 'op2' | 'chefe' | 'admin' | null;

// 2. Definir a estrutura do valor do contexto
interface AuthContextType {
  isAuthenticated: boolean;
  userProfile: UserProfile;
  login: (username: string, password: string) => Promise<boolean>; // Tornando assíncrona para o futuro
  logout: () => void;
  isLoading: boolean; // Para feedback visual durante o login
}

// 3. Criar o Contexto com um valor padrão inicial
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userProfile: null,
  login: async () => false, // Função placeholder
  logout: () => {},       // Função placeholder
  isLoading: true, // Começa como true para verificar estado inicial
});

// 4. Criar o Componente Provedor (AuthProvider)
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Estado de carregamento
  const navigate = useNavigate();

  // Efeito para verificar se há dados de login salvos (ex: token no localStorage) ao carregar
  // Simulação: Por enquanto, apenas define isLoading como false após um tempo
  useEffect(() => {
    // No futuro: Verificar localStorage por token JWT, validar token com API
    // Se válido: setIsAuthenticated(true), setUserProfile(perfilDoToken)
    setTimeout(() => { // Simula a verificação
      setIsLoading(false);
    }, 500); 
  }, []);

  // --- Função de Login (SIMULADA) ---
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    console.log('AuthContext: Tentando login com:', { username }); // Senha não deve ser logada

    // SIMULAÇÃO (será substituída pela chamada API)
    await new Promise(resolve => setTimeout(resolve, 500)); // Simula delay da API

    let loggedIn = false;
    let profile: UserProfile = null;

    if (username === 'admin' && password === 'admin') { loggedIn = true; profile = 'admin'; }
    else if (username === 'op1' && password === 'op1') { loggedIn = true; profile = 'op1'; }
    else if (username === 'op2' && password === 'op2') { loggedIn = true; profile = 'op2'; }
    else if (username === 'chefe' && password === 'chefe') { loggedIn = true; profile = 'chefe'; }

    if (loggedIn) {
      setIsAuthenticated(true);
      setUserProfile(profile);
      // No futuro: Salvar o token JWT no localStorage aqui
      console.log(`AuthContext: Login bem-sucedido como ${profile}`);
      setIsLoading(false);
      return true; // Indica sucesso
    } else {
      console.log('AuthContext: Falha no login');
      setIsLoading(false);
      return false; // Indica falha
    }
    // --- FIM DA SIMULAÇÃO ---
  };

  // --- Função de Logout ---
  const logout = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    // No futuro: Remover o token JWT do localStorage aqui
    // Opcional: Chamar API para invalidar token no backend
    console.log('AuthContext: Logout realizado');
    navigate('/login'); // Redireciona para o login após logout
  };

  // 5. Montar o valor que será fornecido pelo contexto
  const value = {
    isAuthenticated,
    userProfile,
    login,
    logout,
    isLoading, // Inclui o estado de carregamento
  };

  // 6. Retornar o Provedor envolvendo os children
  // Não renderiza nada até que a verificação inicial (useEffect) termine
  return (
    <AuthContext.Provider value={value}>
      {!isLoading ? children : <div>Carregando autenticação...</div> /* Ou um spinner */}
    </AuthContext.Provider>
  );
};

// 7. Criar um Hook customizado para facilitar o uso do contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};