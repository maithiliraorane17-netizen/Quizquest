import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
const Ctx = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('qq_user')); } catch { return null; } });
  const [loading, setLoading] = useState(false);
  const [init, setInit] = useState(true);
  useEffect(() => {
    const v = async () => {
      const t = localStorage.getItem('qq_token');
      if (!t) { setInit(false); return; }
      try { const { data } = await api.get('/auth/me'); setUser(data.user); localStorage.setItem('qq_user', JSON.stringify(data.user)); }
      catch { localStorage.removeItem('qq_token'); localStorage.removeItem('qq_user'); setUser(null); }
      finally { setInit(false); }
    }; v();
  }, []);
  const register = useCallback(async (username, email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { username, email, password });
      localStorage.setItem('qq_token', data.token); localStorage.setItem('qq_user', JSON.stringify(data.user));
      setUser(data.user); toast.success(`Welcome, ${data.user.username}! 🎉`); return { success: true };
    } catch (e) { toast.error(e.response?.data?.message || 'Registration failed'); return { success: false }; }
    finally { setLoading(false); }
  }, []);
  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('qq_token', data.token); localStorage.setItem('qq_user', JSON.stringify(data.user));
      setUser(data.user); toast.success(`Welcome back, ${data.user.username}! ⚡`); return { success: true };
    } catch (e) { toast.error(e.response?.data?.message || 'Login failed'); return { success: false }; }
    finally { setLoading(false); }
  }, []);
  const logout = useCallback(() => {
    localStorage.removeItem('qq_token'); localStorage.removeItem('qq_user');
    setUser(null); toast.success('Logged out!');
  }, []);
  return <Ctx.Provider value={{ user, loading, init, register, login, logout, isAuth: !!user }}>{children}</Ctx.Provider>;
};
export const useAuth = () => { const c = useContext(Ctx); if (!c) throw new Error('useAuth outside Provider'); return c; };
