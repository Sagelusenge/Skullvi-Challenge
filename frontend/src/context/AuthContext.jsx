import { createContext, useEffect, useMemo, useState } from 'react';
import { login as loginRequest } from '../services/authService.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (credentials) => {
    const session = await loginRequest(credentials);
    setUser(session.user);
    setToken(session.token);
    localStorage.setItem('user', JSON.stringify(session.user));
    localStorage.setItem('token', session.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = useMemo(() => ({
    user,
    token,
    login,
    logout,
    isAuthenticated: Boolean(token)
  }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

