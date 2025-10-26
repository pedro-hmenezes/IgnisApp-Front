// src/api/axiosConfig.ts
import axios from 'axios';

// Chaves do localStorage (DEVEM ser as mesmas do AuthContext)
const TOKEN_KEY = 'ignis_auth_token'; 
const PROFILE_KEY = 'ignis_user_profile'; 

// Cria a instância do Axios
const apiClient = axios.create({
  // Usa a variável de ambiente VITE_API_URL ou um fallback com /api
  baseURL: import.meta.env.VITE_API_URL || 'https://ignisappback.onrender.com/api', // Ajuste '/api' se suas rotas não usam prefixo
  headers: {
    'Content-Type': 'application/json',
  },
});

// === INTERCEPTOR DE REQUISIÇÃO ===
// Adiciona o token JWT ao cabeçalho Authorization antes de cada requisição
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    // Adiciona o header apenas se o token existir E o header ainda não estiver definido
    // (Evita sobrescrever se já foi setado manualmente ou pelo AuthContext no carregamento inicial)
    if (token && !config.headers.Authorization) { 
      config.headers.Authorization = `Bearer ${token}`;
      // console.log('AxiosInterceptor: Token adicionado ao header.'); 
    } else if (!token) {
      // console.log('AxiosInterceptor: Nenhum token encontrado.');
    }
    return config; 
  },
  (error) => {
    console.error('AxiosInterceptor Request Error:', error);
    return Promise.reject(error);
  }
);

// === INTERCEPTOR DE RESPOSTA (Recomendado) ===
// Trata erros globais, especialmente o 401 (Não Autorizado)
apiClient.interceptors.response.use(
  response => response, 
  error => {
    if (error.response && error.response.status === 401) {
      console.warn("AxiosInterceptor: Erro 401 (Não Autorizado) detectado. Deslogando...");
      
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(PROFILE_KEY);
      // Remove o header padrão do apiClient para futuras requisições nesta sessão
      delete apiClient.defaults.headers.common['Authorization']; 

      if (window.location.pathname !== '/login') {
        alert("Sua sessão expirou ou é inválida. Por favor, faça login novamente."); 
        // Usar window.location.href força um reload completo, limpando qualquer estado React residual
        window.location.href = '/login'; 
      }
    }
    // Repassa o erro para a chamada original (no service/componente) tratar
    return Promise.reject(error); 
  }
);
// ============================================

export default apiClient;