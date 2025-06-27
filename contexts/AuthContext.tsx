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

// Utility function to safely access localStorage
const getLocalStorageItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return null;
  }
};

const setLocalStorageItem = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error('Error setting localStorage:', error);
  }
};

const removeLocalStorageItem = (key: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing localStorage:', error);
  }
};

// Utility function to validate user data
const validateUserData = (userData: any): userData is User => {
  return (
    userData &&
    typeof userData === 'object' &&
    typeof userData._id === 'string' &&
    typeof userData.fullName === 'string' &&
    typeof userData.email === 'string' &&
    typeof userData.phoneNumber === 'string' &&
    typeof userData.role === 'string' &&
    validRoles.includes(userData.role) &&
    typeof userData.isActive === 'boolean'
  );
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Mark as client-side after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run on client-side
    if (!isClient) return;

    // Check for existing token and user on mount
    const token = getLocalStorageItem('token');
    const userData = getLocalStorageItem('user');
    const role = getLocalStorageItem('role');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        
        if (!validateUserData(parsedUser)) {
          // Invalid user object, force logout
          removeLocalStorageItem('token');
          removeLocalStorageItem('user');
          removeLocalStorageItem('role');
          setUser(null);
          setIsAuthenticated(false);
        } else {
          setUser(parsedUser);
          setIsAuthenticated(true);
          // Defensive: if role is missing or invalid, set it
          if (!role || !validRoles.includes(role)) {
            setLocalStorageItem('role', parsedUser.role);
          }
        }
      } catch (e) {
        // Malformed user data, force logout
        removeLocalStorageItem('token');
        removeLocalStorageItem('user');
        removeLocalStorageItem('role');
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    
    // Set loading to false after rehydration is complete
    setLoading(false);
  }, [isClient]);

  const login = (token: string, userData: User) => {
    if (!validateUserData(userData)) {
      // Invalid user object, force logout
      removeLocalStorageItem('token');
      removeLocalStorageItem('user');
      removeLocalStorageItem('role');
      setUser(null);
      setIsAuthenticated(false);
      throw new Error('Invalid user data provided');
    }

    // Sanitize user data before storing
    const sanitizedUser = {
      _id: userData._id,
      fullName: userData.fullName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      role: userData.role,
      isActive: userData.isActive,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt
    };

    setLocalStorageItem('token', token);
    setLocalStorageItem('user', JSON.stringify(sanitizedUser));
    setLocalStorageItem('role', userData.role);
    setUser(sanitizedUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeLocalStorageItem('token');
    removeLocalStorageItem('user');
    removeLocalStorageItem('role');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <AuthContext.Provider value={{ user: null, isAuthenticated: false, loading: true, login, logout }}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </AuthContext.Provider>
    );
  }

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