import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

/**
 * Authentication Context
 * 
 * Concept Explanation:
 * - What it is: A global React Context store managing user authentication state, tokens, and role permissions.
 * - Why we need it: Makes logged-in user details (`user`, `token`, `role`) accessible to all components without prop drilling.
 * - Where we use it: Wrapped around the root application in App.jsx and consumed via useAuth() hook.
 */
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('eventify_token') || null);
  const [loading, setLoading] = useState(true);

  // Restore authenticated session on initial load
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('eventify_token');
      if (storedToken) {
        try {
          const response = await API.get('/auth/me');
          setUser(response.data.data.user);
          setToken(storedToken);
        } catch (error) {
          console.error('Session restoration failed:', error);
          localStorage.removeItem('eventify_token');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Login Handler
  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      const { user: userData, token: userToken } = response.data.data;

      localStorage.setItem('eventify_token', userToken);
      setUser(userData);
      setToken(userToken);

      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed. Please check credentials.'
      };
    }
  };

  // Registration Handler
  const register = async (formData) => {
    try {
      const response = await API.post('/auth/register', formData);
      const { user: userData, token: userToken } = response.data.data;

      localStorage.setItem('eventify_token', userToken);
      setUser(userData);
      setToken(userToken);

      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Registration failed.'
      };
    }
  };

  // Logout Handler
  const logout = () => {
    localStorage.removeItem('eventify_token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to consume AuthContext cleanly
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
