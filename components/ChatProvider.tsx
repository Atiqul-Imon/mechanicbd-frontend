'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  _id: string;
  roomId: string;
  sender: {
    _id: string;
    fullName: string;
    email: string;
    role: string;
  };
  content: string;
  messageType: 'text' | 'image' | 'file' | 'system';
  attachments: string[];
  isRead: boolean;
  readBy: Array<{
    user: string;
    readAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface ChatRoom {
  _id: string;
  roomId: string;
  roomType: 'customer_mechanic' | 'customer_admin' | 'mechanic_admin' | 'support' | 'booking';
  participants: Array<{
    user: {
      _id: string;
      fullName: string;
      email: string;
      role: string;
    };
    role: string;
    joinedAt: string;
    isActive: boolean;
  }>;
  booking?: {
    _id: string;
    bookingNumber: string;
    service: {
      title: string;
      category: string;
    };
    customer: {
      fullName: string;
    };
    mechanic: {
      fullName: string;
    };
  };
  service?: {
    _id: string;
    title: string;
    category: string;
  };
  title: string;
  lastMessage?: Message;
  lastActivity: string;
  isActive: boolean;
  metadata: {
    customerId?: string;
    mechanicId?: string;
    adminId?: string;
  };
}

interface ChatContextType {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  
  // Chat state
  rooms: ChatRoom[];
  currentRoom: ChatRoom | null;
  messages: Message[];
  unreadCount: number;
  
  // Real-time features
  typingUsers: string[];
  onlineUsers: string[];
  
  // Actions
  connect: () => void;
  disconnect: () => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  sendMessage: (content: string, messageType?: string, attachments?: string[]) => void;
  markAsRead: (roomId: string) => void;
  startTyping: (roomId: string) => void;
  stopTyping: (roomId: string) => void;
  
  // Room management
  createRoom: (roomData: any) => Promise<ChatRoom>;
  getRooms: () => Promise<void>;
  getMessages: (roomId: string, page?: number) => Promise<void>;
  
  // Support chat
  createSupportChat: (issue: string, category?: string) => Promise<ChatRoom>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Connect to WebSocket
  const connect = () => {
    if (!user || !token || socket) return;
    
    setIsConnecting(true);
    
    const SOCKET_URL = process.env.NODE_ENV === 'development'
      ? 'http://localhost:5000'
      : process.env.NEXT_PUBLIC_SOCKET_URL || 'https://mechanicbd-backend.onrender.com';
    
    const newSocket = io(SOCKET_URL, {
      auth: {
        token
      },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
      setIsConnected(true);
      setIsConnecting(false);
      newSocket.emit('set_online');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from chat server');
      setIsConnected(false);
      setIsConnecting(false);
    });

    newSocket.on('new_message', (message: Message) => {
      setMessages(prev => [...prev, message]);
      
      // Update room's last message
      setRooms(prev => prev.map(room => 
        room.roomId === message.roomId 
          ? { ...room, lastMessage: message, lastActivity: message.createdAt }
          : room
      ));
      
      // Update unread count if not in current room
      if (currentRoom?.roomId !== message.roomId) {
        setUnreadCount(prev => prev + 1);
      }
    });

    newSocket.on('user_typing', (data: { userId: string; userName: string; roomId: string }) => {
      if (currentRoom?.roomId === data.roomId) {
        setTypingUsers(prev => [...prev.filter(id => id !== data.userId), data.userId]);
      }
    });

    newSocket.on('user_stop_typing', (data: { userId: string; roomId: string }) => {
      if (currentRoom?.roomId === data.roomId) {
        setTypingUsers(prev => prev.filter(id => id !== data.userId));
      }
    });

    newSocket.on('user_online', (data: { userId: string; userName: string }) => {
      setOnlineUsers(prev => [...prev.filter(id => id !== data.userId), data.userId]);
    });

    newSocket.on('user_offline', (data: { userId: string; userName: string }) => {
      setOnlineUsers(prev => prev.filter(id => id !== data.userId));
    });

    setSocket(newSocket);
  };

  // Disconnect from WebSocket
  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setIsConnecting(false);
    }
  };

  // Join a chat room
  const joinRoom = (roomId: string) => {
    if (socket && isConnected) {
      socket.emit('join_room', roomId);
    }
  };

  // Leave a chat room
  const leaveRoom = (roomId: string) => {
    if (socket && isConnected) {
      socket.emit('leave_room', roomId);
    }
  };

  // Send a message
  const sendMessage = async (content: string, messageType: string = 'text', attachments: string[] = []) => {
    if (!currentRoom || !content.trim()) return;

    try {
      const API_BASE = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:5000/api'
        : process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/api`
          : 'https://mechanicbd-backend.onrender.com/api';
      
      const response = await fetch(`${API_BASE}/chat/rooms/${currentRoom.roomId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: content.trim(),
          messageType,
          attachments
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const { data } = await response.json();
      
      // Add message to local state
      setMessages(prev => [...prev, data.message]);
      
      // Update room's last message
      setRooms(prev => prev.map(room => 
        room.roomId === currentRoom.roomId 
          ? { ...room, lastMessage: data.message, lastActivity: data.message.createdAt }
          : room
      ));

      // Stop typing indicator
      stopTyping(currentRoom.roomId);
      
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Mark messages as read
  const markAsRead = async (roomId: string) => {
    try {
      const API_BASE = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:5000/api'
        : process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/api`
          : 'https://mechanicbd-backend.onrender.com/api';
      
      await fetch(`${API_BASE}/chat/rooms/${roomId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Start typing indicator
  const startTyping = (roomId: string) => {
    if (socket && isConnected) {
      socket.emit('typing_start', roomId);
    }
  };

  // Stop typing indicator
  const stopTyping = (roomId: string) => {
    if (socket && isConnected) {
      socket.emit('typing_stop', roomId);
    }
  };

  // Get chat rooms
  const getRooms = async () => {
    try {
      const API_BASE = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:5000/api'
        : process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/api`
          : 'https://mechanicbd-backend.onrender.com/api';
      
      const response = await fetch(`${API_BASE}/chat/rooms`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const { data } = await response.json();
        setRooms(data.rooms);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  // Get messages for a room
  const getMessages = async (roomId: string, page: number = 1) => {
    try {
      const API_BASE = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:5000/api'
        : process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/api`
          : 'https://mechanicbd-backend.onrender.com/api';
      
      const response = await fetch(
        `${API_BASE}/chat/rooms/${roomId}/messages?page=${page}&limit=50`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const { data } = await response.json();
        setMessages(data.messages);
        markAsRead(roomId);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Create a new room
  const createRoom = async (roomData: any): Promise<ChatRoom> => {
    try {
      const API_BASE = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:5000/api'
        : process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/api`
          : 'https://mechanicbd-backend.onrender.com/api';
      
      const response = await fetch(`${API_BASE}/chat/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(roomData)
      });

      if (!response.ok) {
        throw new Error('Failed to create room');
      }

      const { data } = await response.json();
      setRooms(prev => [data.room, ...prev]);
      return data.room;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  };

  // Create support chat
  const createSupportChat = async (issue: string, category?: string): Promise<ChatRoom> => {
    try {
      const API_BASE = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:5000/api'
        : process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/api`
          : 'https://mechanicbd-backend.onrender.com/api';
      
      const response = await fetch(`${API_BASE}/chat/support`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ issue, category })
      });

      if (!response.ok) {
        throw new Error('Failed to create support chat');
      }

      const { data } = await response.json();
      setRooms(prev => [data.room, ...prev]);
      return data.room;
    } catch (error) {
      console.error('Error creating support chat:', error);
      throw error;
    }
  };

  // Connect on mount and user change
  useEffect(() => {
    if (user && token) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [user, token]);

  // Get rooms on mount
  useEffect(() => {
    if (user && token) {
      getRooms();
    }
  }, [user, token]);

  const value: ChatContextType = {
    isConnected,
    isConnecting,
    rooms,
    currentRoom,
    messages,
    unreadCount,
    typingUsers,
    onlineUsers,
    connect,
    disconnect,
    joinRoom,
    leaveRoom,
    sendMessage,
    markAsRead,
    startTyping,
    stopTyping,
    getRooms,
    getMessages,
    createRoom,
    createSupportChat
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}; 