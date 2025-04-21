// app/(main)/chat/components/ChatMessages.jsx
"use client";

import { useChat } from "../../contexts/ChatContext";
import ChatCard from "./ChatCard";
import { useEffect, useRef } from "react";
import TypewriterEffect from "./TypewriterEffect";
import ReactMarkdown from "react-markdown";
import { axiosInstance } from "@/lib/axios"; // Import axios instance with token handling

export default function ChatMessages({ userData }) {
  const { messages, isTyping } = useChat();
  const messagesEndRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Handle attachment download with authenticated request
  const handleAttachmentClick = async (e, href) => {
    e.preventDefault(); // Prevent default link behavior
    const urlParams = new URLSearchParams(new URL(href).search);
    const emailId = urlParams.get("emailId");
    const attachmentId = urlParams.get("attachmentId");

    try {
      const response = await axiosInstance.get(`/emails/download/attachment`, {
        params: { emailId, attachmentId },
        responseType: "blob", // Handle binary data
      });

      // Create a blob URL and trigger download
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = e.target.textContent || "attachment"; // Use link text as filename, fallback to "attachment"
      document.body.appendChild(link); // Append to body for Firefox compatibility
      link.click();
      document.body.removeChild(link); // Clean up
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download attachment:", error);
      alert("Failed to download attachment. Please try again."); // User feedback
    }
  };

  // Custom link component for ReactMarkdown
  const CustomLink = ({ href, children }) => {
    // Check if the link is an attachment download link
    if (href.includes("/api/v1/emails/download/attachment")) {
      return (
        <a href={href} onClick={(e) => handleAttachmentClick(e, href)}>
          {children}
        </a>
      );
    }
    // Render regular links as normal
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-6 overflow-y-scroll messages scroll-smooth flex flex-col">
        {messages.map((message, index) => (
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
                <ReactMarkdown
                  components={{
                    a: CustomLink, // Use custom link component
                  }}
                >
                  {message.message}
                </ReactMarkdown>
              ) : (
                message.message
              )
            }
            attachments={message?.attachments}
            senderUser={message.userRole === "user"}
          />
        ))}

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
