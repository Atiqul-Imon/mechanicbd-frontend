'use client';

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChatProvider } from '../../components/ChatProvider';
import { GuestChatProvider } from '../../components/GuestChatProvider';
import { ChatInterface } from '../../components/ChatInterface';

export default function ChatPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for guest sessionId in query or localStorage
  const sessionId = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      return (
        searchParams.get('sessionId') ||
        localStorage.getItem('guestSessionId')
      );
    }
    return null;
  }, [searchParams]);

  // Redirect if not authenticated and no guest session
  React.useEffect(() => {
    if (!loading && !isAuthenticated && !sessionId) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, sessionId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading chat...</p>
        </div>
      </div>
    );
  }

  // If neither, show nothing (will redirect)
  if (!isAuthenticated && !sessionId) {
    return null;
  }

  // Authenticated user
  if (isAuthenticated && user) {
    return (
      <ChatProvider>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600 mt-2">
                Connect with mechanics, admins, and get support for your bookings
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[calc(100vh-200px)]">
              <ChatInterface />
            </div>
          </div>
        </div>
      </ChatProvider>
    );
  }

  // Guest user
  if (sessionId && !isAuthenticated) {
    return (
      <GuestChatProvider>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600 mt-2">
                Connect with admins and get support for your questions
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[calc(100vh-200px)]">
              <ChatInterface />
            </div>
          </div>
        </div>
      </GuestChatProvider>
    );
  }

  return null;
} 