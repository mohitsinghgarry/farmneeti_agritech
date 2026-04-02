import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthState, User, UserRole } from '../types';
import { authApi } from '../services/mockApi';

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      try {
        const storedUser = localStorage.getItem('agrilink_user');
        const storedToken = localStorage.getItem('agrilink_token');

        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
        localStorage.removeItem('agrilink_user');
        localStorage.removeItem('agrilink_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(email, password, role);
      setUser(response.user);
      setToken(response.token);
      setIsAuthenticated(true);

      // Persist to localStorage
      localStorage.setItem('agrilink_user', JSON.stringify(response.user));
      localStorage.setItem('agrilink_token', response.token);

      // Navigate to role-specific dashboard
      navigate(`/${role}/dashboard`);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('agrilink_user');
    localStorage.removeItem('agrilink_token');
    navigate('/login');
  };

  const value: AuthState = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthState => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
