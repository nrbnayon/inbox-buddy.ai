"use client";

import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [tokenCount, setTokenCount] = useState(0);
  const [models, setModels] = useState([]);
  const [chats, setChats] = useState([]);

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        addMessage,
        clearMessages,
        isTyping,
        setIsTyping,
        selectedModel,
        setSelectedModel,
        tokenCount,
        setTokenCount,
        models,
        setModels,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
