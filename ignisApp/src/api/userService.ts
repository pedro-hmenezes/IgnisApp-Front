// src/api/userService.ts
// (Opcional) Importar tipos de usuário se definidos globalmente
import apiClient from './axiosConfig';

// --- DEFINIÇÃO DE TIPOS ---

// Payload para criar um usuário (o que o front-end envia)
interface UserCreatePayload {
  name: string;
  email: string;
  role: 'operador' | 'major' | 'administrador'; // Controller ainda espera esses valores
  password: string; // Senha em texto plano
}

// Resposta esperada da API (usuário criado, SEM o hash da senha)
interface UserCreatedResponse {
  _id: string; // ID do MongoDB
  name: string;
  email: string;
  role: 'operador' | 'major' | 'administrador';
  createdAt?: string | Date; // Timestamps podem vir na resposta
  updatedAt?: string | Date;
  // NÃO incluir passwordHash
}

// Interface para usuário (lista e detalhes)
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'operador' | 'major' | 'administrador';
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// Payload para atualizar usuário
export interface UserUpdatePayload {
  name?: string;
  email?: string;
  role?: 'operador' | 'major' | 'administrador';
  password?: string; // Opcional: atualizar senha
}

// --- FUNÇÃO DO SERVIÇO ---

export const createUser = async (userData: UserCreatePayload): Promise<UserCreatedResponse> => {
  try {
    console.log("Chamando API para criar usuário:", { ...userData, password: '***' }); // Log sem a senha
    
    // Backend espera 'password' mas também aceita 'passwordHash' na validação
    // Enviar ambos para garantir compatibilidade
    const payload = {
      name: userData.name,
      email: userData.email,
      role: userData.role || 'operador', // Valor padrão conforme controller
      password: userData.password,
      passwordHash: userData.password // Backend valida esse campo
    };
    
    const response = await apiClient.post<UserCreatedResponse>('/users', payload);
    return response.data;
  } catch (error: unknown) {
    // Log detalhado do erro
    console.error('Erro ao criar usuário:', error);
    
    // Reempacotar mensagem amigável
    let message = 'Falha ao cadastrar usuário.';
    if (error && typeof error === 'object') {
      const e = error as { response?: { status?: number; data?: { message?: string; errors?: unknown } }; message?: string };
      
      // Log da resposta completa do servidor para debug
      if (e.response) {
        console.error('Status:', e.response.status);
        console.error('Dados do erro:', e.response.data);
      }
      
      // Mensagem detalhada incluindo erros de validação se houver
      if (e.response?.data?.errors) {
        message = `${e.response.data.message || 'Erro de validação'}: ${JSON.stringify(e.response.data.errors)}`;
      } else {
        message = e.response?.data?.message || e.message || message;
      }
    }
    throw new Error(message);
  }
};

// Listar todos os usuários
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get<User[]>('/users/');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    
    // Mensagem mais detalhada para debug
    if (error && typeof error === 'object') {
      const e = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
      
      if (e.response?.status === 404) {
        throw new Error('Rota GET /users/ não encontrada. Verifique se o backend possui a rota configurada.');
      }
      
      const message = e.response?.data?.message || e.message || 'Falha ao carregar usuários.';
      throw new Error(message);
    }
    
    throw new Error('Falha ao carregar usuários.');
  }
};

// Buscar usuário por ID
export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw new Error('Falha ao carregar usuário.');
  }
};

// Atualizar usuário
export const updateUser = async (id: string, userData: UserUpdatePayload): Promise<User> => {
  try {
    const response = await apiClient.put<User>(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    let message = 'Falha ao atualizar usuário.';
    if (error && typeof error === 'object') {
      const e = error as { response?: { data?: { message?: string } }; message?: string };
      message = e.response?.data?.message || e.message || message;
    }
    throw new Error(message);
  }
};

// Deletar usuário
export const deleteUser = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await apiClient.delete<{ message: string }>(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    let message = 'Falha ao deletar usuário.';
    if (error && typeof error === 'object') {
      const e = error as { response?: { data?: { message?: string } }; message?: string };
      message = e.response?.data?.message || e.message || message;
    }
    throw new Error(message);
  }
};