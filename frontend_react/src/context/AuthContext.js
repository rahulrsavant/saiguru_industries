import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { clearAuthState, getAuthState, setAuthState } from '../utils/authStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthStateInternal] = useState(() => getAuthState());

  useEffect(() => {
    const handleStorage = () => setAuthStateInternal(getAuthState());
    window.addEventListener('storage', handleStorage);
    window.addEventListener('saiguru:logout', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('saiguru:logout', handleStorage);
    };
  }, []);

  const login = useCallback((nextAuth) => {
    setAuthState(nextAuth);
    setAuthStateInternal(nextAuth);
  }, []);

  const logout = useCallback(() => {
    clearAuthState();
    setAuthStateInternal(null);
  }, []);

  const value = useMemo(
    () => ({
      token: authState?.token || null,
      user: authState?.user || null,
      login,
      logout,
    }),
    [authState, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
