// app\(main)\chat\components\ChatMessages.jsx
"use client";
import React from "react";
import { useChat } from "./ChatContext";
import ChatMessage from "./ChatMessage";

export default function ChatMessages() {
  const { messages, isTyping } = useChat();

  return (
    <div className='space-y-6'>
      {messages.map((message, index) => (
        <ChatMessage key={index} {...message} />
      ))}

      {isTyping && (
        <ChatMessage
          role='assistant'
          message={
            <div className='flex items-center gap-2'>
              <span>Thinking</span>
              <span className='animate-pulse'>...</span>
            </div>
          }
        />
      )}
    </div>
  );
}