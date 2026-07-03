// src/services/api.ts
// Cliente HTTP base para consumir APIs del backend VIGIA
// Referencia: VIG-53 — "Configurar cliente HTTP base para consumir APIs del backend"

import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';

// ══════════════════════════════════════════════════════════════
// CONFIGURACIÓN BASE
// ══════════════════════════════════════════════════════════════

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * Instancia Axios configurada para el backend VIGIA.
 *
 * Características:
 * - Base URL desde variable de entorno VITE_API_BASE_URL
 * - Timeout de 15 segundos
 * - Content-Type JSON por defecto
 * - Interceptor de request para inyectar JWT (cuando auth esté implementada)
 * - Interceptor de response para manejo centralizado de errores
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ══════════════════════════════════════════════════════════════
// INTERCEPTOR DE REQUEST — Inyección de JWT
// ══════════════════════════════════════════════════════════════

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // TODO: Cuando autenticación esté implementada, obtener token del store/context
    const token = localStorage.getItem('vigia_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ══════════════════════════════════════════════════════════════
// INTERCEPTOR DE RESPONSE — Manejo centralizado de errores
// ══════════════════════════════════════════════════════════════

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token expirado o inválido — limpiar sesión y redirigir a login
          localStorage.removeItem('vigia_access_token');
          // TODO: Redirigir a /login cuando el auth flow esté completo
          console.warn('[VIGIA API] 401 — Sesión expirada');
          break;
        case 403:
          console.warn('[VIGIA API] 403 — Acceso denegado');
          break;
        case 404:
          console.warn('[VIGIA API] 404 — Recurso no encontrado');
          break;
        case 500:
          console.error('[VIGIA API] 500 — Error interno del servidor');
          break;
        default:
          console.error(
            `[VIGIA API] ${error.response.status} — Error no manejado`
          );
      }
    } else if (error.request) {
      console.error(
        '[VIGIA API] Sin respuesta del servidor — verificar conectividad'
      );
    }
    return Promise.reject(error);
  }
);

// ══════════════════════════════════════════════════════════════
// HELPERS TIPADOS
// ══════════════════════════════════════════════════════════════

/**
 * GET tipado
 */
export const apiGet = async <T>(
  url: string,
  params?: Record<string, unknown>
): Promise<T> => {
  const response = await apiClient.get<T>(url, { params });
  return response.data;
};

/**
 * POST tipado
 */
export const apiPost = async <T>(url: string, data?: unknown): Promise<T> => {
  const response = await apiClient.post<T>(url, data);
  return response.data;
};

/**
 * PUT tipado
 */
export const apiPut = async <T>(url: string, data?: unknown): Promise<T> => {
  const response = await apiClient.put<T>(url, data);
  return response.data;
};

/**
 * DELETE tipado
 */
export const apiDelete = async <T>(url: string): Promise<T> => {
  const response = await apiClient.delete<T>(url);
  return response.data;
};

export default apiClient;
