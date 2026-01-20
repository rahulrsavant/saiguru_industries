import { STORAGE_KEYS, readJson, writeJson } from './storage';
import { buildEstimateNo, getNextDailyCounter } from './estimateUtils';

const DEFAULT_SETTINGS = {
  prefix: 'SI',
  unitSystem: 'metric',
};

const DEFAULT_CUSTOMER = {
  name: '',
  businessName: '',
  mobile: '',
  email: '',
};

const DEFAULT_TOTALS = {
  totalWeightKg: 0,
};

export const getSettings = () => {
  const stored = readJson(STORAGE_KEYS.settings, null);
  return { ...DEFAULT_SETTINGS, ...(stored || {}) };
};

export const saveSettings = (settings) => {
  writeJson(STORAGE_KEYS.settings, { ...DEFAULT_SETTINGS, ...settings });
};

export const loadCurrentEstimateSession = () => {
  return readJson(STORAGE_KEYS.currentSession, null);
};

export const createNewEstimateSession = () => {
  const settings = getSettings();
  const { date, counter } = getNextDailyCounter();
  const estimateNo = buildEstimateNo({
    prefix: settings.prefix || DEFAULT_SETTINGS.prefix,
    date,
    counter,
    timestamp: Date.now(),
  });
  const now = new Date().toISOString();
  const session = {
    estimateNo,
    customer: { ...DEFAULT_CUSTOMER },
    items: [],
    totals: { ...DEFAULT_TOTALS },
    createdAt: now,
    updatedAt: now,
  };
  writeJson(STORAGE_KEYS.currentSession, session);
  return session;
};

export const persistCurrentEstimateSession = (session) => {
  if (!session) return;
  writeJson(STORAGE_KEYS.currentSession, session);
};

export const getEstimateHistory = () => {
  const history = readJson(STORAGE_KEYS.history, []);
  return Array.isArray(history) ? history : [];
};

export const upsertHistoryEntry = (session) => {
  if (!session) return;
  const history = getEstimateHistory();
  const index = history.findIndex((entry) => entry.estimateNo === session.estimateNo);
  const now = new Date().toISOString();
  const nextEntry = {
    ...session,
    createdAt: session.createdAt || now,
    updatedAt: now,
  };
  if (index >= 0) {
    history[index] = nextEntry;
  } else {
    history.unshift(nextEntry);
  }
  history.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
  writeJson(STORAGE_KEYS.history, history);
};

export const clearEstimateHistory = () => {
  writeJson(STORAGE_KEYS.history, []);
};

export const setCurrentSessionFromHistory = (estimate) => {
  if (!estimate) return;
  const now = new Date().toISOString();
  const session = {
    ...estimate,
    updatedAt: now,
  };
  writeJson(STORAGE_KEYS.currentSession, session);
};
