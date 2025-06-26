'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('customer' | 'mechanic' | 'admin')[];
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect while loading (rehydrating from localStorage)
    if (loading) {
      return;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated || !user) {
      router.push(redirectTo);
      return;
    }

    // If specific roles are required, check if user has permission
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on user role
      switch (user.role) {
        case 'customer':
          router.push('/dashboard/customer');
          break;
        case 'mechanic':
          router.push('/dashboard/mechanic');
          break;
        case 'admin':
          router.push('/dashboard/admin');
          break;
        default:
          router.push('/');
      }
      return;
    }
  }, [isAuthenticated, user, loading, allowedRoles, redirectTo, router]);

  // Show loading spinner while rehydrating
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // If not authenticated, don't render children (will redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  // If specific roles are required and user doesn't have permission, don't render children
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return null;
  }

  // User is authenticated and has permission, render children
  return <>{children}</>;
} 