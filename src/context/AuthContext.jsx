import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/me');
        setUser(response.data.data || response.data);
      } catch (error) {
        console.error('Session verify error:', error);
        localStorage.removeItem('access_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    
    const token = response.data.access_token || response.data.token || response.data.data?.access_token;
    const userData = response.data.user || response.data.data?.user;

    if (token) {
      localStorage.setItem('access_token', token);
    }
    
    if (userData) {
      setUser(userData);
    } else {
      const meRes = await api.get('/me');
      setUser(meRes.data.data || meRes.data);
    }

    return response;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);