import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const bootstrapToken = localStorage.getItem('token');

    if (!bootstrapToken) {
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    api.get('/auth/me')
      .then((res) => {
        if (!isMounted) return;
        setUser(res.data);
      })
      .catch(() => {
        if (!isMounted) return;
        // Avoid clearing a freshly-updated token from a newer successful login.
        if (localStorage.getItem('token') === bootstrapToken) {
          localStorage.removeItem('token');
          setUser(null);
        }
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password, portal = 'any') => {
    const { data } = await api.post('/auth/login', { email, password, portal });
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
