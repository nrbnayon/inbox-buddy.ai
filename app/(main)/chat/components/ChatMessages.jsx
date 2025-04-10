// app/(main)/chat/components/ChatMessages.jsx
"use client";

import { useChat } from "./ChatContext"; // Assuming a context provides chat data
import ChatCard from "./ChatCard";
import { useEffect, useRef } from "react";
import TypewriterEffect from "./TypewriterEffect"; // Placeholder for typing animation
import ReactMarkdown from "react-markdown";

export default function ChatMessages({ userData }) {
  const { messages, isTyping } = useChat(); // Fetch messages and typing state from context
  const messagesEndRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-6 overflow-y-scroll messages scroll-smooth flex flex-col">
        {messages.map((message, index) => {
          console.log(message);
          return (
            <ChatCard
              key={index}
              userName={
                message.userName ||
                (message.userRole === "user" ? "You" : "Inbox Buddy")
              }
              userRole={
                message.userRole === "user"
                  ? "user"
                  : message?.model || message.userRole
              }
              avatarUrl={userData.profilePicture}
              date={message.date}
              message={
                message.userRole !== "user" ? (
                  <ReactMarkdown>{message.message}</ReactMarkdown>
                ) : (
                  message.message
                )
              }
              attachments={message?.attachments}
              senderUser={message.userRole === "user"}
            />
          );
        })}

        {isTyping && (
          <ChatCard
            userName="Inbox Buddy"
            userRole="Assistant"
            avatarUrl="🤖"
            date={new Date().toLocaleString()}
            message={<TypewriterEffect />}
          />
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
