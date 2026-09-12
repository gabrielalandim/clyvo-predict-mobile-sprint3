import axios, { AxiosError } from 'axios';
import { API_BASE_URL, DEFAULT_TIMEOUT_MS } from '@config/env';
import { sessionStorage } from './session';
import { authEvents } from './authEvents';
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use(async (config) => {
  const token = await sessionStorage.getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
      await sessionStorage.clearSession();
      authEvents.emitUnauthorized();
    }
    return Promise.reject(error);
  },
);
export function extractApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<any>;
    const data = err.response?.data;
    if (err.code === 'ECONNABORTED') {
      return 'A API demorou demais para responder. Verifique se o backend Java (e o Python, no caso da IA) estão rodando.';
    }
    if (!err.response) {
      return 'Não foi possível conectar à API. Confira o IP configurado em src/config/env.ts e se o Java está rodando nessa rede.';
    }
    if (err.response.status === 401 || err.response.status === 403) {
      return 'Sua sessão expirou ou você não tem permissão. Faça login novamente.';
    }
    if (Array.isArray(data) && data.length && data[0]?.mensagem) {
      return data.map((e: any) => `${e.campo}: ${e.mensagem}`).join('\n');
    }
    if (typeof data === 'string' && data.trim()) return data;
    if (data?.mensagem) return data.mensagem;
    if (data?.message) return data.message;
  }
  return fallback;
}
