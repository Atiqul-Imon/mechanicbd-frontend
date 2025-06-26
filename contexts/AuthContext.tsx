'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: 'customer' | 'mechanic' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const validRoles = ['customer', 'mechanic', 'admin'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and user on mount
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (!parsedUser.role || !validRoles.includes(parsedUser.role)) {
          // Invalid user object, force logout
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('role');
          setUser(null);
          setIsAuthenticated(false);
        } else {
          setUser(parsedUser);
          setIsAuthenticated(true);
          // Defensive: if role is missing or invalid, set it
          if (!role || !validRoles.includes(role)) {
            localStorage.setItem('role', parsedUser.role);
          }
        }
      } catch (e) {
        // Malformed user data, force logout
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    
    // Set loading to false after rehydration is complete
    setLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    if (!userData.role || !validRoles.includes(userData.role)) {
      // Invalid user object, force logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      setUser(null);
      setIsAuthenticated(false);
      return;
    }
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', userData.role); // Save role separately
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role'); // Remove role
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 