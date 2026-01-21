import { getAuthState, clearAuthState } from './authStorage';

export const authFetch = async (url, options = {}) => {
  const auth = getAuthState();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (auth?.token) {
    headers.Authorization = `Bearer ${auth.token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearAuthState();
    window.dispatchEvent(new Event('saiguru:logout'));
  }

  return response;
};
