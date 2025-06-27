'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('customer' | 'mechanic' | 'admin')[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/login',
  fallback
}: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Mark as client-side after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Don't redirect while loading (rehydrating from localStorage) or not client-side
    if (loading || !isClient) {
      return;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated || !user) {
      setShouldRedirect(true);
      router.push(redirectTo);
      return;
    }

    // If specific roles are required, check if user has permission
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      setShouldRedirect(true);
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

    // User is authenticated and has permission
    setShouldRedirect(false);
  }, [isAuthenticated, user, loading, allowedRoles, redirectTo, router, isClient]);

  // Show loading spinner while rehydrating or not client-side
  if (loading || !isClient) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-light)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)] font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated or should redirect, don't render children
  if (!isAuthenticated || !user || shouldRedirect) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-light)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)] font-medium">Redirecting...</p>
        </div>
      </div>
    );
  }

  // If specific roles are required and user doesn't have permission, don't render children
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-light)]">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-xl font-semibold mb-2 text-[var(--color-text-primary)]">Access Denied</h2>
          <p className="text-[var(--color-text-secondary)] mb-4">You don't have permission to access this page.</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--color-primary-dark)] transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // User is authenticated and has permission, render children
  return <>{children}</>;
} 