import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setAuthToken } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth on page mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          setAuthToken(token);
          const res = await api.get('/auth/me');
          setUser(res.data.data.user);
        } else {
          // Attempt silent refresh via httpOnly cookie
          const res = await api.post('/auth/refresh');
          if (res.data?.data?.accessToken) {
            setAuthToken(res.data.data.accessToken);
            setUser(res.data.data.user);
          }
        }
      } catch {
        setAuthToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password, rememberMe = false) => {
    const res = await api.post('/auth/login', { email, password, rememberMe });
    const { user: loggedInUser, accessToken } = res.data.data;
    setAuthToken(accessToken);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const { user: registeredUser, accessToken } = res.data.data;
    setAuthToken(accessToken);
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setAuthToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
