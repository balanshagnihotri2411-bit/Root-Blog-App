import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMeApi } from '../api/auth.api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('roots_token') || null);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage + validate token with server
  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem('roots_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await getMeApi();
        setUser(data.user);
        setToken(storedToken);
      } catch {
        // Token invalid/expired — clear storage
        localStorage.removeItem('roots_token');
        localStorage.removeItem('roots_user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = useCallback(({ token: t, user: u }) => {
    localStorage.setItem('roots_token', t);
    localStorage.setItem('roots_user', JSON.stringify(u));
    setToken(t);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('roots_token');
    localStorage.removeItem('roots_user');
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('roots_user', JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
