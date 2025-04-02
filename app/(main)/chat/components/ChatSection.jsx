'use client';

import { useEffect, useRef } from 'react';
import { useChat } from './ChatContext';
import ChatMessages from './ChatMessages';
import ChatInputField from './ChatInputField';
import { getDefaultModel } from '@/lib/api';

export default function ChatSection() {
  const { setSelectedModel } = useChat();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const defaultModel = await getDefaultModel();
        setSelectedModel(defaultModel);
      } catch (error) {
        console.error('Failed to load default model:', error);
      }
    };

    initializeChat();
  }, [setSelectedModel]);

  return (
    <section className="flex-1 p-1 lg:p-8 max-h-[81vh] h-screen rounded-[20px]">
      <div className="mx-auto h-full flex flex-col">
        <div className="flex-1 overflow-y-auto messages">
          <ChatMessages />
          <div ref={messagesEndRef} />
        </div>
        <ChatInputField onMessageSent={scrollToBottom} />
      </div>
    </section>
  );
}