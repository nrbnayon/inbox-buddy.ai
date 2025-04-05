// app\(main)\chat\components\ChatInputField.jsx
"use client";

import { useRef, useState, useEffect } from "react";
import { useChat } from "./ChatContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, X } from "lucide-react";
import { FaCheckCircle } from "react-icons/fa";
import { IoDocumentOutline } from "react-icons/io5";
import { sendChatMessage, clearChatContext } from "@/lib/api/chat";

export default function ChatInputField({ onMessageSent }) {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const {
    messages,
    addMessage,
    clearMessages,
    setIsTyping,
    selectedModel,
    setTokenCount,
  } = useChat();

  // Debug logging to inspect the selectedModel value
  useEffect(() => {
    console.log("Current selectedModel in ChatInputField:", selectedModel);
  }, [selectedModel]);

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setIsUploading(true);
      const newAttachments = files.map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        file,
      }));

      setAttachments((prev) => [...prev, ...newAttachments]);
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeAttachment = (id) => {
    setAttachments(attachments.filter((attachment) => attachment.id !== id));
  };



  // Get conversation history in the format expected by the API
  const getConversationHistory = () => {
    const history = [];
    // Group messages in pairs of user and assistant
    for (let i = 0; i < messages.length; i += 2) {
      if (messages[i] && messages[i].role === "user") {
        history.push({
          role: "user",
          content: messages[i].message,
        });

        if (messages[i + 1] && messages[i + 1].role === "assistant") {
          history.push({
            role: "assistant",
            content: messages[i + 1].message,
          });
        }
      }
    }
    return history;
  };

  const handleSendMessage = async () => {
    if (!message.trim() && attachments.length === 0) return;

    // Get file if there are attachments
    const file = attachments.length > 0 ? attachments[0].file : null;

    // Create user message object
    const userMessage = {
      role: "user",
      userName: "You",
      userRole: "User",
      date: new Date().toLocaleString(),
      message: message,
      attachments: attachments.length > 0 ? [...attachments] : [],
    };

    // Add user message to chat
    addMessage(userMessage);
    setIsTyping(true);

    try {
      // Prepare conversation history
      const history = getConversationHistory();

      // Extract the model ID using the correct property
      const modelId = selectedModel?.id || selectedModel?.value || null;

      console.log("Sending message with model ID:", modelId);

      // Send message with file and selected model ID
      const response = await sendChatMessage(message, file, modelId);

      setIsTyping(false);

      // Create assistant message object
      const assistantMessage = {
        role: "assistant",
        userName: "AI Assistant",
        userRole: "Assistant",
        date: new Date().toLocaleString(),
        message: response.message,
      };

      // Add assistant response to chat
      addMessage(assistantMessage);

      // Update token count
      setTokenCount((prev) => prev + (response.tokenCount || 0));

      // Clear message and attachments
      setMessage("");
      setAttachments([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Call callback if provided
      onMessageSent?.();
    } catch (error) {
      console.error("Failed to send message:", error);
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full mx-auto flex flex-col mt-6">
      {(attachments.length > 0 || isUploading) && (
        <div className="order-1 md:order-2 mb-3 md:mt-3 md:mb-0 flex items-center gap-1 md:gap-3">
          <p className="text-sm font-medium mb-2 md:mb-0 hidden md:inline-flex">
            Attachments:
          </p>
          <div className="flex flex-wrap gap-2">
            {isUploading && (
              <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-background text-sm">
                <p className="animate-pulse">Uploading...</p>
              </div>
            )}

            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center gap-2 border border-blue-500 rounded-md px-3 py-2 bg-background text-sm group"
              >
                <span className="bg-[#D1E9FF] rounded-full p-1">
                  <IoDocumentOutline className="h-4 w-4 text-blue-500" />
                </span>
                <span className="max-w-[200px] truncate">
                  {attachment.name}
                </span>
                <FaCheckCircle className="h-4 w-4 text-blue-500" />
                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="order-2 md:order-1 relative flex items-start gap-2">
        <div className="flex-1 relative">
          <Textarea
            placeholder="Write message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-[128px] resize-none pr-4 py-3 rounded-xl border bg-background focus-visible:ring-0"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl h-12 w-12 border-muted"
            onClick={handleAttachmentClick}
          >
            <Paperclip className="h-5 w-5" />
          </Button>

          <Button
            size="icon"
            className="rounded-xl h-12 w-12 link-btn cursor-pointer"
            onClick={handleSendMessage}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
      </div>
    </div>
  );
}
