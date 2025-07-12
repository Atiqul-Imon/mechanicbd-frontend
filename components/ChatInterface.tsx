'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from './ChatProvider';
import { useAuth } from '../contexts/AuthContext';

interface ChatInterfaceProps {
  onClose?: () => void;
  initialRoomId?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onClose, initialRoomId }) => {
  const { 
    rooms, 
    currentRoom, 
    messages, 
    isConnected, 
    sendMessage, 
    joinRoom, 
    leaveRoom, 
    getMessages,
    startTyping,
    stopTyping,
    typingUsers,
    createSupportChat
  } = useChat();
  
  const { user } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(initialRoomId || null);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportIssue, setSupportIssue] = useState('');
  const [supportCategory, setSupportCategory] = useState('general');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Join room when selected
  useEffect(() => {
    if (selectedRoom) {
      const room = rooms.find(r => r.roomId === selectedRoom);
      if (room) {
        joinRoom(selectedRoom);
        getMessages(selectedRoom);
      }
    }
  }, [selectedRoom, rooms]);

  // Handle typing indicator
  useEffect(() => {
    if (isTyping && selectedRoom) {
      startTyping(selectedRoom);
    } else if (selectedRoom) {
      stopTyping(selectedRoom);
    }
  }, [isTyping, selectedRoom]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedRoom) return;
    
    sendMessage(messageInput.trim());
    setMessageInput('');
    setIsTyping(false);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCreateSupportChat = async () => {
    if (!supportIssue.trim()) return;
    
    try {
      const room = await createSupportChat(supportIssue, supportCategory);
      setSelectedRoom(room.roomId);
      setShowSupportModal(false);
      setSupportIssue('');
      setSupportCategory('general');
    } catch (error) {
      console.error('Error creating support chat:', error);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getRoomTitle = (room: any) => {
    if (room.title) return room.title;
    
    const otherParticipants = room.participants
      .filter((p: any) => p.user._id !== user?._id)
      .map((p: any) => p.user.fullName);
    
    return otherParticipants.join(', ') || 'Chat Room';
  };

  const getLastMessagePreview = (room: any) => {
    if (!room.lastMessage) return 'No messages yet';
    
    const content = room.lastMessage.content;
    return content.length > 50 ? `${content.substring(0, 50)}...` : content;
  };

  return (
    <div className="flex h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Room List */}
      <div className="w-1/3 border-r border-gray-200 bg-gray-50">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
          <button
            onClick={() => setShowSupportModal(true)}
            className="mt-2 w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Contact Support
          </button>
        </div>
        
        <div className="overflow-y-auto h-full">
          {rooms.map((room) => (
            <div
              key={room.roomId}
              onClick={() => setSelectedRoom(room.roomId)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors ${
                selectedRoom === room.roomId ? 'bg-red-50 border-r-2 border-red-600' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {getRoomTitle(room)}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {getLastMessagePreview(room)}
                  </p>
                </div>
                <div className="text-xs text-gray-400 ml-2">
                  {room.lastActivity ? formatTime(room.lastActivity) : ''}
                </div>
              </div>
            </div>
          ))}
          
          {rooms.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No conversations yet
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {getRoomTitle(rooms.find(r => r.roomId === selectedRoom)!)}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className="text-sm text-gray-500">
                      {isConnected ? 'Online' : 'Offline'}
                    </span>
                    {typingUsers.length > 0 && (
                      <span className="text-sm text-gray-500 italic">
                        {typingUsers.length === 1 ? 'Someone is typing...' : 'Multiple people typing...'}
                      </span>
                    )}
                  </div>
                </div>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${message.sender._id === user?._id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender._id === user?._id
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">
                      {message.sender.fullName}
                    </div>
                    <div className="text-sm">{message.content}</div>
                    <div className={`text-xs mt-1 ${
                      message.sender._id === user?._id ? 'text-red-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={handleTyping}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Contact Support</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={supportCategory}
                onChange={(e) => setSupportCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="general">General</option>
                <option value="technical">Technical Issue</option>
                <option value="billing">Billing</option>
                <option value="booking">Booking Issue</option>
                <option value="service">Service Related</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe your issue
              </label>
              <textarea
                value={supportIssue}
                onChange={(e) => setSupportIssue(e.target.value)}
                placeholder="Please describe your issue..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setShowSupportModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSupportChat}
                disabled={!supportIssue.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 