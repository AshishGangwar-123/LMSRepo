const DEFAULT_LOCAL_API_BASE_URL = 'https://lms-backend-production-8776.up.railway.app/';

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE_URL = (configuredApiBaseUrl || DEFAULT_LOCAL_API_BASE_URL).replace(/\/+$/, '');

export function apiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
