// app/(main)/chat/components/ChatMessages.jsx
"use client";

import { useChat } from "./ChatContext"; // Assuming a context provides chat data
import ChatCard from "./ChatCard";
import { useEffect, useRef } from "react";
import TypewriterEffect from "./TypewriterEffect"; // Placeholder for typing animation
import ReactMarkdown from "react-markdown";

export default function ChatMessages() {
  const { messages, isTyping } = useChat(); // Fetch messages and typing state from context
  const messagesEndRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className='space-y-6'>
      {messages.map((message, index) => (
        <ChatCard
          key={index}
          userName={message.userName}
          userRole={message.userRole}
          avatarUrl={message.avatarUrl}
          date={message.date}
          message={
            message.userRole === "Assistant" ? (
              <ReactMarkdown>{message.message}</ReactMarkdown>
            ) : (
              message.message
            )
          }
          senderUser={message.userRole === "user"}
        />
      ))}

      {isTyping && (
        <ChatCard
          userName='AI Assistant'
          userRole='Assistant'
          avatarUrl='🤖'
          date={new Date().toLocaleString()}
          message={<TypewriterEffect />}
        />
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
