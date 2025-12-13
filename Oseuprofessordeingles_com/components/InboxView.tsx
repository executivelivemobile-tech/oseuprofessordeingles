import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message, Notification, User } from '../types';

interface InboxViewProps {
  currentUser: User;
  conversations: Conversation[];
  notifications: Notification[];
  onSendMessage: (conversationId: string, text: string) => void;
  onMarkNotificationRead: (id: string) => void;
}

export const InboxView: React.FC<InboxViewProps> = ({ 
    currentUser, 
    conversations, 
    notifications, 
    onSendMessage,
    onMarkNotificationRead
}) => {
  const [activeTab, setActiveTab] = useState<'MESSAGES' | 'NOTIFICATIONS'>('MESSAGES');
  const [selectedConvId, setSelectedConvId] = useState<string | null>(conversations[0]?.id || null);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === selectedConvId);

  // Auto-scroll to bottom of chat
  useEffect(() => {
      if (activeTab === 'MESSAGES' && selectedConvId) {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
  }, [activeConversation, activeTab, selectedConvId]);

  const handleSend = () => {
      if (!inputText.trim() || !selectedConvId) return;
      onSendMessage(selectedConvId, inputText);
      setInputText('');
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-10 max-w-6xl mx-auto h-[calc(100vh-80px)] flex flex-col">
        <h1 className="text-3xl font-bold text-white mb-6 pt-6">Comms Center</h1>
        
        <div className="flex-1 bg-gray-900/80 border border-gray-800 rounded-2xl overflow-hidden flex shadow-2xl backdrop-blur-sm">
            {/* Sidebar */}
            <div className="w-full md:w-80 border-r border-gray-800 flex flex-col bg-black/20">
                {/* Tabs */}
                <div className="flex border-b border-gray-800">
                    <button 
                        onClick={() => setActiveTab('MESSAGES')}
                        className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'MESSAGES' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-900/10' : 'text-gray-500 hover:text-white'}`}
                    >
                        Messages
                        {conversations.some(c => c.unreadCount > 0) && <span className="ml-2 w-2 h-2 bg-red-500 rounded-full inline-block"></span>}
                    </button>
                    <button 
                        onClick={() => setActiveTab('NOTIFICATIONS')}
                        className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'NOTIFICATIONS' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-900/10' : 'text-gray-500 hover:text-white'}`}
                    >
                        Alerts
                        {notifications.some(n => !n.read) && <span className="ml-2 w-2 h-2 bg-red-500 rounded-full inline-block"></span>}
                    </button>
                </div>

                {/* List Content */}
                <div className="flex-1 overflow-y-auto">
                    {activeTab === 'MESSAGES' && (
                        <div className="divide-y divide-gray-800">
                            {conversations.map(conv => (
                                <button 
                                    key={conv.id}
                                    onClick={() => setSelectedConvId(conv.id)}
                                    className={`w-full p-4 flex items-center gap-3 hover:bg-gray-800/50 transition-colors text-left ${selectedConvId === conv.id ? 'bg-cyan-900/20 border-l-2 border-cyan-400' : 'border-l-2 border-transparent'}`}
                                >
                                    <div className="relative">
                                        <img src={conv.partnerAvatar} alt={conv.partnerName} className="w-12 h-12 rounded-full object-cover" />
                                        {conv.unreadCount > 0 && (
                                            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                                {conv.unreadCount}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className={`font-bold truncate ${conv.unreadCount > 0 ? 'text-white' : 'text-gray-300'}`}>{conv.partnerName}</h4>
                                            <span className="text-xs text-gray-600">{conv.lastMessageTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </div>
                                        <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'text-gray-200 font-medium' : 'text-gray-500'}`}>{conv.lastMessage}</p>
                                    </div>
                                </button>
                            ))}
                            {conversations.length === 0 && (
                                <div className="p-8 text-center text-gray-500 text-sm">
                                    No conversations yet. Book a teacher to start chatting!
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'NOTIFICATIONS' && (
                        <div className="divide-y divide-gray-800">
                            {notifications.length > 0 ? notifications.map(notif => (
                                <div 
                                    key={notif.id} 
                                    className={`p-4 flex gap-3 ${!notif.read ? 'bg-gray-800/30' : ''}`}
                                    onClick={() => onMarkNotificationRead(notif.id)}
                                >
                                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!notif.read ? 'bg-cyan-500' : 'bg-transparent'}`}></div>
                                    <div>
                                        <p className="text-sm text-gray-200 mb-1">{notif.message}</p>
                                        <p className="text-xs text-gray-600">{notif.date || 'Just now'}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-8 text-center text-gray-500 text-sm">
                                    All caught up! No new alerts.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col bg-gray-900/50 relative">
                {activeTab === 'MESSAGES' ? (
                    selectedConvId && activeConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-black/20">
                                <div className="flex items-center gap-3">
                                    <img src={activeConversation.partnerAvatar} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <h3 className="font-bold text-white">{activeConversation.partnerName}</h3>
                                        <span className="text-xs text-green-400 flex items-center gap-1">● Online</span>
                                    </div>
                                </div>
                                <button className="text-gray-500 hover:text-white">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {activeConversation.messages.map(msg => {
                                    const isMe = msg.senderId === currentUser.id;
                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                                                isMe 
                                                ? 'bg-cyan-600 text-white rounded-br-none shadow-[0_0_10px_rgba(8,145,178,0.3)]' 
                                                : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'
                                            }`}>
                                                {msg.text}
                                                <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-cyan-200' : 'text-gray-500'}`}>
                                                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-4 border-t border-gray-800 bg-black/20">
                                <div className="flex gap-2">
                                    <input 
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                    />
                                    <button 
                                        onClick={handleSend}
                                        className="bg-cyan-600 hover:bg-cyan-500 text-white p-3 rounded-xl transition-all shadow-lg"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            </div>
                            <p>Select a conversation to start messaging.</p>
                        </div>
                    )
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        </div>
                        <p>View your latest alerts and system notifications here.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};