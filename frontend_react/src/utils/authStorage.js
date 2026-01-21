const AUTH_STORAGE_KEY = 'saiguru_auth';

export const getAuthState = () => {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};

export const setAuthState = (state) => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
};

export const clearAuthState = () => {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
};
