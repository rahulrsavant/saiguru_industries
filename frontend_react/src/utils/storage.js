export const STORAGE_KEYS = {
  lastCounterDate: 'si_lastCounterDate',
  counter: 'si_counter',
  currentSession: 'si_current_estimate_session',
  history: 'si_estimate_history',
  settings: 'si_settings',
};

export const readJson = (key, fallback) => {
  if (typeof localStorage === 'undefined') return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
};

export const writeJson = (key, value) => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

export const readString = (key, fallback = '') => {
  if (typeof localStorage === 'undefined') return fallback;
  const value = localStorage.getItem(key);
  return value == null ? fallback : value;
};

export const writeString = (key, value) => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(key, String(value));
};

export const readNumber = (key, fallback = 0) => {
  if (typeof localStorage === 'undefined') return fallback;
  const value = Number(localStorage.getItem(key));
  return Number.isFinite(value) ? value : fallback;
};

export const writeNumber = (key, value) => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(key, String(value));
};
