'use client';

import React, { useState, useEffect } from 'react';
import { useChat } from './ChatProvider';
import { useAuth } from '../contexts/AuthContext';
import { ChatInterface } from './ChatInterface';

interface ChatWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
  showUnreadCount?: boolean;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  position = 'bottom-right',
  showUnreadCount = true 
}) => {
  const { user, isAuthenticated } = useAuth();
  const { unreadCount, isConnected } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);

  // Don't render if user is not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
          <div className="flex justify-between items-center p-4 bg-red-600 text-white">
            <h3 className="font-semibold">Chat Support</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-gray-400'}`}></div>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:text-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {!isMinimized && (
            <div className="h-full">
              <ChatInterface onClose={() => setIsOpen(false)} />
            </div>
          )}
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-all duration-200 hover:scale-110 ${
          isOpen ? 'rotate-180' : ''
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        
        {/* Unread Count Badge */}
        {showUnreadCount && unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};

// Quick Support Button Component
export const QuickSupportButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { user, isAuthenticated } = useAuth();
  const { createSupportChat } = useChat();
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickSupport = async () => {
    if (!isAuthenticated || !user) return;
    
    setIsLoading(true);
    try {
      await createSupportChat('Quick support request', 'general');
      // You can add navigation to chat page here
    } catch (error) {
      console.error('Error creating support chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <button
      onClick={handleQuickSupport}
      disabled={isLoading}
      className={`inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 ${className}`}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )}
      <span>{isLoading ? 'Connecting...' : 'Quick Support'}</span>
    </button>
  );
}; 