// src/api/axiosConfig.ts
import axios from 'axios';

// Chave do token (deve ser a mesma usada no AuthContext)
const TOKEN_KEY = 'ignis_auth_token'; 

const apiClient = axios.create({
  baseURL: '/api', // Mantenha ou ajuste sua baseURL
  headers: {
    'Content-Type': 'application/json',
  },
});

// === INTERCEPTOR DE REQUISIÇÃO ===
// Esta função será executada ANTES de cada requisição ser enviada
apiClient.interceptors.request.use(
  (config) => {
    // Pega o token do localStorage
    const token = localStorage.getItem(TOKEN_KEY);
    // Se o token existir, adiciona ao cabeçalho Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('AxiosInterceptor: Token adicionado ao header:', `Bearer ${token.substring(0, 10)}...`); // Log para debug
    } else {
      console.log('AxiosInterceptor: Nenhum token encontrado no localStorage.'); // Log para debug
    }
    return config; // Retorna a configuração modificada (ou original)
  },
  (error) => {
    // Faz algo se ocorrer um erro ao configurar a requisição
    console.error('AxiosInterceptor Error:', error);
    return Promise.reject(error);
  }
);
// ===============================

// Opcional: Adicionar interceptor de RESPOSTA para tratar erros 401 (Token inválido/expirado) globalmente
// apiClient.interceptors.response.use(
//   response => response, // Se a resposta for sucesso, apenas repassa
//   error => {
//     if (error.response && error.response.status === 401) {
//       console.log("AxiosInterceptor: Erro 401 detectado. Deslogando...");
//       // Limpar localStorage e redirecionar para login
//       localStorage.removeItem(TOKEN_KEY);
//       localStorage.removeItem(PROFILE_KEY);
//       // Evitar loop se o erro 401 for na própria tela de login
//       if (window.location.pathname !== '/login') {
//         window.location.href = '/login'; // Força reload para limpar estado
//       }
//     }
//     return Promise.reject(error); // Repassa o erro para a chamada original tratar
//   }
// );

export default apiClient;