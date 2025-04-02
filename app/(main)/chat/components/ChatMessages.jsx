'use client';

import { useChat } from './ChatContext';
import ChatCard from './ChatCard';
import { useEffect, useRef } from 'react';
import TypewriterEffect from './TypewriterEffect';

export default function ChatMessages() {
  const { messages, isTyping } = useChat();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="space-y-6">
      {messages.map((message, index) => (
        <ChatCard
          key={index}
          {...message}
          senderUser={message.role === 'user'}
        />
      ))}
      
      {isTyping && (
        <ChatCard
          userName="AI Assistant"
          userRole="Assistant"
          avatarUrl="/ai-avatar.png"
          date={new Date().toLocaleString()}
          message={<TypewriterEffect />}
        />
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}