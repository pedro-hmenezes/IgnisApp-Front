// src/api/userService.ts
// (Opcional) Importar tipos de usuário se definidos globalmente
// import type { IUser } from '../types/user'; 

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

  // === CHAMADA REAL (Descomentar depois) ===
  // Se quiser usar a chamada real, descomente a linha abaixo e importe `apiClient` no topo do arquivo:
  // const response = await apiClient.post<UserCreatedResponse>('/users', userData); // Ajuste o endpoint '/users' se necessário
  // return response.data;
  // =======================================

    // === SIMULAÇÃO ===
    await new Promise(resolve => setTimeout(resolve, 700)); // Simula delay
    // Cria um mock da resposta, omitindo a senha e adicionando ID/timestamps
    const mockUserResponse: UserCreatedResponse = {
      _id: `mock_user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    console.log("Simulação: Usuário criado:", mockUserResponse);
    return mockUserResponse;
    // === FIM SIMULAÇÃO ===

  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    // Verificar se o erro tem uma resposta da API com mensagem específica
    // Ex: if (axios.isAxiosError(error) && error.response?.data?.message) { throw new Error(error.response.data.message); }
    throw error; // Relança o erro para o componente/hook tratar
  }
};

// Futuramente: Adicionar outras funções (getUsers, getUserById, updateUser, deleteUser)