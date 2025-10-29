// src/api/authService.ts
import apiClient from './axiosConfig';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    nome: string;
    email: string;
    perfil: string;
  };
}

export const loginUser = async (email: string, senha: string): Promise<LoginResponse> => {
  // Rota conhecida (conforme backend): /api/users/login
  // Permite override via VITE_LOGIN_PATH se necessário
  const explicitPath: string | undefined = (typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: Record<string, string> }).env)
    ? ((import.meta as unknown as { env: Record<string, string> }).env['VITE_LOGIN_PATH'])
    : undefined;
  const url = explicitPath?.startsWith('/') ? explicitPath : (explicitPath ? `/${explicitPath}` : '/users/login');

  console.info(`[AuthService] Login em ${apiClient.defaults.baseURL || ''}${url} com chaves: email,password`);

  // Retry leve para mitigar cold start do backend (Render/host free)
  type AxiosLikeError = { response?: { status?: number } };
  const shouldRetry = (err: unknown): boolean => {
    try {
      const anyErr = err as AxiosLikeError;
      const status: number | undefined = anyErr.response?.status;
      // Retry em erros transitórios: sem resposta (network), 408, 429, 5xx
      if (!anyErr.response) return true;
      return [408, 429, 500, 502, 503, 504].includes(status || 0);
    } catch {
      return false;
    }
  };
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  let resp;
  let attempt = 0;
  const maxAttempts = 3;
  while (attempt < maxAttempts) {
    try {
      resp = await apiClient.post(url, { email, password: senha });
      break;
    } catch (err) {
      attempt += 1;
      if (attempt >= maxAttempts || !shouldRetry(err)) {
        throw err;
      }
      const backoff = 600 * attempt; // 600ms, 1200ms
      console.warn(`[AuthService] Falha transitória no login (tentativa ${attempt}/${maxAttempts}), aguardando ${backoff}ms...`);
      await sleep(backoff);
    }
  }

  // Normaliza diferentes formatos de resposta do backend
  const raw: unknown = resp!.data;
  const get = (obj: unknown, path: Array<string>): unknown => {
    return path.reduce<unknown>((acc, key) => {
      if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
  };
  const tokenVal = (get(raw, ['token']) ?? get(raw, ['jwt']) ?? get(raw, ['accessToken']) ?? get(raw, ['data', 'token'])) as string | undefined;
  const userCandidate = (get(raw, ['user']) ?? get(raw, ['data', 'user']) ?? raw) as Record<string, unknown> | unknown;
  const perfilVal = (get(userCandidate, ['perfil']) ?? get(userCandidate, ['role']) ?? get(userCandidate, ['profile']) ?? get(raw, ['perfil']) ?? get(raw, ['role']) ?? get(raw, ['profile'])) as string | undefined;
  const normalized: LoginResponse = {
    token: tokenVal || '',
    user: {
      id: String((get(userCandidate, ['id']) ?? get(userCandidate, ['_id']) ?? get(raw, ['userId']) ?? get(raw, ['id']) ?? '') as unknown),
      nome: String((get(userCandidate, ['nome']) ?? get(userCandidate, ['name']) ?? get(userCandidate, ['fullName']) ?? '') as unknown),
      email: String((get(userCandidate, ['email']) ?? get(raw, ['email']) ?? '') as unknown),
      perfil: (perfilVal ?? '') as string,
    },
  };
  console.log('[AuthService] Login OK em rota fixa');
  return normalized;
};
