// src/api/userService.ts
// (Opcional) Importar tipos de usuário se definidos globalmente
import apiClient from './axiosConfig';

// --- DEFINIÇÃO DE TIPOS ---

// Payload para criar um usuário (o que o front-end envia)
interface UserCreatePayload {
  name: string;
  email: string;
  role: 'operador' | 'major' | 'administrador'; // Conforme seu schema
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

// --- FUNÇÃO DO SERVIÇO ---

export const createUser = async (userData: UserCreatePayload): Promise<UserCreatedResponse> => {
  try {
    console.log("Chamando API para criar usuário:", { ...userData, password: '***' }); // Log sem a senha
    // Tentativa principal (sem prefixo)
    const response = await apiClient.post<UserCreatedResponse>('/users', userData);
    return response.data;
  } catch (error: unknown) {
    // Fallback: se rota estiver montada com prefixo /api
    if (error && typeof error === 'object' && 'response' in error) {
      const resp = (error as { response?: { status?: number } }).response;
      if (resp?.status === 404) {
        try {
          console.warn('createUser: 404 em /users, tentando /api/users');
          const alt = await apiClient.post<UserCreatedResponse>('/api/users', userData);
          return alt.data;
        } catch (fallbackErr) {
          console.error('Erro no fallback POST /api/users:', fallbackErr);
          throw fallbackErr;
        }
      }
    }
    // Reempacotar mensagem amigável
    let message = 'Falha ao cadastrar usuário.';
    if (error && typeof error === 'object') {
      const e = error as { response?: { data?: { message?: string } }; message?: string };
      message = e.response?.data?.message || e.message || message;
    }
    throw new Error(message);
  }
};

// Futuramente: Adicionar outras funções (getUsers, getUserById, updateUser, deleteUser)