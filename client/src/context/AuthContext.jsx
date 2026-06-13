import { createContext, useContext, useState } from 'react';
import { authService } from '../services/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try { return JSON.parse(localStorage.getItem('patitas_user')); } catch { return null; }
  });
  const [cargando, setCargando] = useState(false);

  const login = async (email, password) => {
    setCargando(true);
    try {
      const { cliente, token } = await authService.login(email, password);
      localStorage.setItem('patitas_token', token);
      localStorage.setItem('patitas_user', JSON.stringify(cliente));
      setUsuario(cliente);
      return cliente;
    } finally {
      setCargando(false);
    }
  };

  const register = async (datos) => {
    setCargando(true);
    try {
      const { cliente, token } = await authService.register(datos);
      localStorage.setItem('patitas_token', token);
      localStorage.setItem('patitas_user', JSON.stringify(cliente));
      setUsuario(cliente);
      return cliente;
    } finally {
      setCargando(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
