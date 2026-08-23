import axios from 'axios';
import { getTokens, saveTokens, clearTokens } from '../storage/tokenStorage';
import i18n, { getStoredLanguage } from '../../i18n';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const CLIENT_ID_STORAGE_KEY = 'gymmi-client-id';

/**
 * Resolve the language sent to the API as `Accept-Language`, normalized to a
 * supported value (`en` | `es`). Prefers the live i18next language and falls
 * back to the persisted Settings preference.
 */
function getRequestLanguage(): string {
  const active = i18n.language;
  if (active === 'en' || active === 'es') {
    return active;
  }
  return getStoredLanguage();
}

/**
 * Stable per-browser client id so auth throttling is not shared across
 * Playwright workers / browser contexts that all used to send "web".
 */
function getClientId(): string {
  if (typeof localStorage === 'undefined') {
    return 'web';
  }
  const existing = localStorage.getItem(CLIENT_ID_STORAGE_KEY);
  if (existing) return existing;
  const next = `web-${crypto.randomUUID()}`;
  localStorage.setItem(CLIENT_ID_STORAGE_KEY, next);
  return next;
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  config.headers['X-Client-Id'] = getClientId();
  config.headers['Accept-Language'] = getRequestLanguage();
  const { accessToken } = getTokens();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const url: string = originalRequest.url || '';
    const isAuthEndpoint = url.startsWith('/auth/');

    if (error.response?.status !== 401 || originalRequest._retry || isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { refreshToken } = getTokens();
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
        refreshToken,
      });

      saveTokens(data.accessToken, data.refreshToken);
      processQueue(null, data.accessToken);

      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearTokens();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
