// app\(main)\chat\components\ChatSection.jsx
"use client";

import React, { useEffect, useRef } from "react";
import { useChat } from "./ChatContext";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInputField from "./ChatInputField";

export default function ChatSection() {
  const { messages } = useChat();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className='h-screen flex flex-col'>
      {/* Header */}
      <ChatHeader />

      {/* Messages Area */}
      <div className='flex-1 overflow-y-auto px-4 py-6'>
        {messages.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full text-center'>
            <h1 className='text-4xl font-bold mb-2'>Inbox-Buddy.AI</h1>
            <p className='text-gray-600 mb-8'>Your email assistant</p>
            <h2 className='text-xl font-semibold mb-4'>
              Welcome to your AI Assistant!
            </h2>
            <div className='max-w-md space-y-4'>
              <p className='text-gray-500'>
                I can help you manage your emails, draft responses, find
                specific messages, and more. Just ask me anything!
              </p>
              <div className='text-sm text-gray-500'>
                Try asking:
                <ul className='mt-2 space-y-2'>
                  <li>"Show my unread emails"</li>
                  <li>"Find emails from [sender]"</li>
                  <li>"Draft a response to [subject]"</li>
                  <li>"Summarize my recent emails"</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <ChatMessages />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className='border-t bg-white p-4'>
        <ChatInputField />
      </div>
    </div>
  );
}