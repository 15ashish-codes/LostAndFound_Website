import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api/axios.js';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('lf_user')) || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // Sync user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('lf_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('lf_user');
    }
  }, [user]);

  const register = useCallback(async (data) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/register', data);
      setUser(res.data.data);
      toast.success('Account created! Welcome 🎉');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (data) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', data);
      setUser(res.data.data);
      toast.success(`Welcome back, ${res.data.data.name}! 👋`);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  const updateUser = useCallback((updated) => {
    setUser((prev) => ({ ...prev, ...updated }));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, updateUser, isAdmin: user?.role === 'admin' }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};