'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../utils/api';

interface GuestChatWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
  onRegister?: () => void;
}

export const GuestChatWidget: React.FC<GuestChatWidgetProps> = ({ 
  position = 'bottom-right',
  onRegister 
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestData, setGuestData] = useState({
    name: '',
    phoneNumber: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check for existing session
    const existingSessionId = localStorage.getItem('guestSessionId');
    if (existingSessionId) {
      setSessionId(existingSessionId);
    }
  }, []);

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/guest/session', guestData);
      const data = response.data;

      if (data.success) {
        setSessionId(data.data.sessionId);
        localStorage.setItem('guestSessionId', data.data.sessionId);
        setShowGuestForm(false);
        setIsMinimized(false);
      } else {
        setError(data.message || 'Failed to create guest session');
      }
    } catch (error: any) {
      console.error('Guest session error:', error);
      setError(error.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartChat = () => {
    if (sessionId) {
      // User has session, redirect to chat
      router.push(`/chat?sessionId=${sessionId}`);
    } else {
      // Show guest form
      setShowGuestForm(true);
    }
  };

  const handleRegister = () => {
    setIsOpen(false);
    if (onRegister) {
      onRegister();
    } else {
      router.push('/register');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowGuestForm(false);
    setError(null);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div
        className={`fixed ${position === 'bottom-right' ? 'bottom-4 right-4' : 'bottom-4 left-4'} z-50`}
      >
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            aria-label="Open chat"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        ) : (
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-80 max-h-96 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Need Help?</h3>
                    <p className="text-xs opacity-90">Chat with our support team</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Chat Content */}
            <div className="p-4">
              {!showGuestForm ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">How can we help you?</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Get instant support for your questions about our services
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleStartChat}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      {sessionId ? 'Continue Chat' : 'Start Chat'}
                    </button>
                    
                    <button
                      onClick={handleRegister}
                      className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      Create Account
                    </button>
                  </div>

                  <div className="text-xs text-gray-500 text-center">
                    By starting a chat, you agree to our{' '}
                    <a href="/terms" className="text-red-600 hover:underline">Terms of Service</a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleGuestSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={guestData.name}
                      onChange={(e) => setGuestData({ ...guestData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Your name"
                      minLength={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={guestData.phoneNumber}
                      onChange={(e) => setGuestData({ ...guestData, phoneNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="+880 1XXX XXX XXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={guestData.email}
                      onChange={(e) => setGuestData({ ...guestData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                      {error}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowGuestForm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Starting...' : 'Start Chat'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}; 