'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';


interface GuestChatContextType {
  // Connection state
  isConnected: boolean;
  sessionId: string | null;
  guestData: {
    name: string;
    phoneNumber?: string;
    email?: string;
  } | null;
  
  // Chat state
  rooms: any[];
  currentRoom: string | null;
  messages: any[];
  typingUsers: string[];
  
  // Actions
  connect: (sessionId: string) => Promise<void>;
  disconnect: () => void;
  sendMessage: (content: string) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  getMessages: (roomId: string) => Promise<void>;
  startTyping: (roomId: string) => void;
  stopTyping: (roomId: string) => void;
  createSupportChat: (issue: string, category: string) => Promise<any>;
  
  // Guest management
  createGuestSession: (data: { name: string; phoneNumber?: string; email?: string }) => Promise<string>;
  updateGuestSession: (data: Partial<{ name: string; phoneNumber: string; email: string }>) => Promise<void>;
}

const GuestChatContext = createContext<GuestChatContextType | undefined>(undefined);

export const useGuestChat = () => {
  const context = useContext(GuestChatContext);
  if (!context) {
    throw new Error('useGuestChat must be used within a GuestChatProvider');
  }
  return context;
};

interface GuestChatProviderProps {
  children: React.ReactNode;
}

export const GuestChatProvider: React.FC<GuestChatProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [guestData, setGuestData] = useState<any>(null);
  
  // Chat state
  const [rooms, setRooms] = useState<any[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // API base URL
  const API_BASE = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000/api'
    : process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL}/api`
      : 'https://mechanicbd-backend.onrender.com/api';
  const SOCKET_URL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : process.env.NEXT_PUBLIC_SOCKET_URL || 'https://mechanicbd-backend.onrender.com';

  // Create guest session
  const createGuestSession = useCallback(async (data: { name: string; phoneNumber?: string; email?: string }) => {
    try {
      const response = await fetch(`${API_BASE}/guest/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to create guest session');
      }

      const newSessionId = result.data.sessionId;
      setSessionId(newSessionId);
      setGuestData(result.data);
      
      // Store in localStorage
      localStorage.setItem('guestSessionId', newSessionId);
      localStorage.setItem('guestData', JSON.stringify(result.data));

      return newSessionId;
    } catch (error) {
      console.error('Error creating guest session:', error);
      throw error;
    }
  }, [API_BASE]);

  // Update guest session
  const updateGuestSession = useCallback(async (data: Partial<{ name: string; phoneNumber: string; email: string }>) => {
    if (!sessionId) throw new Error('No active session');

    try {
      const response = await fetch(`${API_BASE}/guest/session/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to update guest session');
      }

      setGuestData(result.data);
      localStorage.setItem('guestData', JSON.stringify(result.data));
    } catch (error) {
      console.error('Error updating guest session:', error);
      throw error;
    }
  }, [sessionId, API_BASE]);

  // Connect to WebSocket
  const connect = useCallback(async (newSessionId: string) => {
    if (socket) {
      socket.disconnect();
    }

    const newSocket = io(SOCKET_URL, {
      auth: {
        token: `guest_${newSessionId}` // Simple guest token
      },
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('🔌 Guest connected to WebSocket');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Guest disconnected from WebSocket');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error: Error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    });

    // Chat events
    newSocket.on('message_received', (message: any) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('user_typing', (data: any) => {
      if (data.isTyping) {
        setTypingUsers(prev => [...prev.filter(id => id !== data.userId), data.userId]);
      } else {
        setTypingUsers(prev => prev.filter(id => id !== data.userId));
      }
    });

    newSocket.on('user_joined', (data: any) => {
      console.log('User joined:', data);
    });

    newSocket.on('user_left', (data: any) => {
      console.log('User left:', data);
    });

    setSocket(newSocket);
  }, [SOCKET_URL]);

  // Disconnect
  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setIsConnected(false);
    setSessionId(null);
    setGuestData(null);
    setRooms([]);
    setMessages([]);
    setCurrentRoom(null);
    setTypingUsers([]);
    
    // Clear localStorage
    localStorage.removeItem('guestSessionId');
    localStorage.removeItem('guestData');
  }, [socket]);

  // Get chat rooms
  const getRooms = useCallback(async () => {
    if (!sessionId) return;

    try {
      const response = await fetch(`${API_BASE}/guest/session/${sessionId}/rooms`);
      const result = await response.json();

      if (result.success) {
        setRooms(result.data.rooms || []);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  }, [sessionId, API_BASE]);

  // Get messages for a room
  const getMessages = useCallback(async (roomId: string) => {
    if (!sessionId) return;

    try {
      const response = await fetch(`${API_BASE}/chat/messages/${roomId}?sessionId=${sessionId}`);
      const result = await response.json();

      if (result.success) {
        setMessages(result.data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [sessionId, API_BASE]);

  // Join room
  const joinRoom = useCallback((roomId: string) => {
    if (socket && isConnected) {
      socket.emit('join_room', roomId);
      setCurrentRoom(roomId);
    }
  }, [socket, isConnected]);

  // Leave room
  const leaveRoom = useCallback((roomId: string) => {
    if (socket && isConnected) {
      socket.emit('leave_room', roomId);
      if (currentRoom === roomId) {
        setCurrentRoom(null);
      }
    }
  }, [socket, isConnected, currentRoom]);

  // Send message
  const sendMessage = useCallback((content: string) => {
    if (!socket || !isConnected || !currentRoom || !sessionId) return;

    const message = {
      roomId: currentRoom,
      content: content.trim(),
      sessionId
    };

    socket.emit('new_message', message);
  }, [socket, isConnected, currentRoom, sessionId]);

  // Typing indicators
  const startTyping = useCallback((roomId: string) => {
    if (socket && isConnected) {
      socket.emit('typing_start', roomId);
    }
  }, [socket, isConnected]);

  const stopTyping = useCallback((roomId: string) => {
    if (socket && isConnected) {
      socket.emit('typing_stop', roomId);
    }
  }, [socket, isConnected]);

  // Create support chat
  const createSupportChat = useCallback(async (issue: string, category: string) => {
    if (!sessionId) throw new Error('No active session');

    try {
      const response = await fetch(`${API_BASE}/chat/support`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          issue,
          category,
          sessionId
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to create support chat');
      }

      // Refresh rooms
      await getRooms();

      return result.data;
    } catch (error) {
      console.error('Error creating support chat:', error);
      throw error;
    }
  }, [sessionId, API_BASE, getRooms]);

  // Initialize from localStorage
  useEffect(() => {
    const storedSessionId = localStorage.getItem('guestSessionId');
    const storedGuestData = localStorage.getItem('guestData');

    if (storedSessionId && storedGuestData) {
      try {
        const parsedData = JSON.parse(storedGuestData);
        setSessionId(storedSessionId);
        setGuestData(parsedData);
        
        // Connect to WebSocket
        connect(storedSessionId);
      } catch (error) {
        console.error('Error parsing stored guest data:', error);
        // Clear invalid data
        localStorage.removeItem('guestSessionId');
        localStorage.removeItem('guestData');
      }
    }
  }, [connect]);

  // Fetch rooms when connected
  useEffect(() => {
    if (isConnected && sessionId) {
      getRooms();
    }
  }, [isConnected, sessionId, getRooms]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const value: GuestChatContextType = {
    isConnected,
    sessionId,
    guestData,
    rooms,
    currentRoom,
    messages,
    typingUsers,
    connect,
    disconnect,
    sendMessage,
    joinRoom,
    leaveRoom,
    getMessages,
    startTyping,
    stopTyping,
    createSupportChat,
    createGuestSession,
    updateGuestSession,
  };

  return (
    <GuestChatContext.Provider value={value}>
      {children}
    </GuestChatContext.Provider>
  );
}; 