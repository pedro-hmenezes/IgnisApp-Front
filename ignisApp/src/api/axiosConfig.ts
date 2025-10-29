// src/api/axiosConfig.ts
import axios from 'axios';

// Chaves do localStorage (DEVEM ser as mesmas do AuthContext)
const TOKEN_KEY = 'ignis_auth_token'; 

// Usa exatamente a baseURL informada (sem acrescentar "/api").
// Se nada vier no env, usa https://ignisappback.onrender.com/api como fallback
const baseURL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, '')
  || 'https://ignisappback.onrender.com/api';

// Cria a instância do Axios com a base informada
const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log para depurar baseURL efetiva (útil para diagnosticar problemas no Vercel)
console.log('Axios baseURL:', baseURL);

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
    // Log do request (leve). Útil para depurar 404/401
    try {
      const method = (config.method || 'get').toUpperCase();
      const fullUrl = `${config.baseURL ?? ''}${config.url ?? ''}`;
      const headers = config.headers as Record<string, unknown> | undefined;
      const hasAuth = Boolean(headers && 'Authorization' in headers && headers.Authorization);
      console.info(`[HTTP] ${method} ${fullUrl} auth=${hasAuth}`);
    } catch { /* noop */ }
    return config; 
  },
  (error) => {
    console.error('AxiosInterceptor Request Error:', error);
    return Promise.reject(error);
  }
);

// === INTERCEPTOR DE RESPOSTA ===
// Trata erros globais, especialmente o 401 (Não Autorizado)
apiClient.interceptors.response.use(
  response => response, 
  error => {
    // Se receber 401, desloga e redireciona para login
    if (error.response && error.response.status === 401) {
      console.warn("AxiosInterceptor: Erro 401 (Não Autorizado) detectado. Deslogando...");
      
      localStorage.removeItem(TOKEN_KEY);
      delete apiClient.defaults.headers.common['Authorization']; 
      
      // Redireciona para login apenas se não estiver já na tela de login
      if (window.location.pathname !== '/login') {
        alert("Sua sessão expirou ou é inválida. Por favor, faça login novamente."); 
        window.location.href = '/login'; 
      }
    }
    
    // Repassa o erro para a chamada original (no service/componente) tratar
    return Promise.reject(error); 
  }
);
// ============================================

export default apiClient;