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
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const {
    messages,
    addMessage,
    clearMessages,
    setIsTyping,
    selectedModel,
    setTokenCount,
  } = useChat();

  useEffect(() => {
    console.log("Current selectedModel in ChatInputField:", selectedModel);
  }, [selectedModel]);

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Limit to only one file to match the backend implementation
      const file = files[0];

      // Check file type
      const supportedTypes = [
        "text/plain",
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!supportedTypes.includes(file.type)) {
        setError(
          `Unsupported file type: ${file.type}. Only .txt, .pdf, and .docx files are supported.`
        );
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      setIsUploading(true);
      setError(null);

      // Only add the first file as an attachment
      const newAttachment = {
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        file,
      };

      setAttachments([newAttachment]); // Replace existing attachments
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeAttachment = (id) => {
    setAttachments(attachments.filter((attachment) => attachment.id !== id));
  };

  const getConversationHistory = () => {
    try {
      // Filter out valid messages with both 'role' and 'message' properties
      const validMessages = messages.filter(
        (msg) =>
          msg &&
          msg.role &&
          (msg.role === "user" || msg.role === "assistant") &&
          msg.message !== undefined
      );

      // Create a properly formatted history array
      const history = validMessages.map((msg) => ({
        role: msg.role,
        content: msg.message,
      }));

      // Debug log
      console.log("Processing messages:", JSON.stringify(messages));
      console.log("Created history:", JSON.stringify(history));

      return history;
    } catch (error) {
      console.error("Error formatting conversation history:", error);
      return []; // Return empty history on error
    }
  };

  const handleSendMessage = async () => {
    if ((!message.trim() && attachments.length === 0) || isSending) return;

    setIsSending(true);
    setError(null);

    try {
      // Get only the first file (if any)
      const file = attachments.length > 0 ? attachments[0].file : null;

      const userMessage = {
        role: "user",
        userName: "You",
        userRole: "User",
        date: new Date().toLocaleString(),
        message: message,
        attachments: attachments.length > 0 ? [...attachments] : [],
      };

      addMessage(userMessage);
      setIsTyping(true);

      // Get model ID
      let modelId = selectedModel?.id || selectedModel?.value || null;
      console.log("Selected model for message:", selectedModel);
      console.log("Using model ID:", modelId);

      // Get history if needed
      const history = getConversationHistory();

      try {
        // Try sending the message
        const response = await sendChatMessage(message, file, modelId, history);

        setIsTyping(false);

        const assistantMessage = {
          role: "assistant",
          userName: "AI Assistant",
          userRole: "Assistant",
          date: new Date().toLocaleString(),
          message: response.message,
        };

        addMessage(assistantMessage);
        if (response.tokenCount) {
          setTokenCount((prev) => prev + response.tokenCount);
        }

        setMessage("");
        setAttachments([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        onMessageSent?.();
      } catch (error) {
        console.error("Failed to send message:", error);
        setIsTyping(false);

        // Show error to user
        const errorMessage = {
          role: "assistant",
          userName: "AI Assistant",
          userRole: "Assistant",
          date: new Date().toLocaleString(),
          message: `I'm having trouble responding right now. ${
            error.message || "Please try again later."
          }`,
        };

        addMessage(errorMessage);
        setError(error.message);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setIsTyping(false);
      setError(error.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className='w-full mx-auto flex flex-col mt-6'>
      {error && (
        <div className='order-0 p-2 mb-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm'>
          {error}
        </div>
      )}

      {(attachments.length > 0 || isUploading) && (
        <div className='order-1 md:order-2 mb-3 md:mt-3 md:mb-0 flex items-center gap-1 md:gap-3'>
          <p className='text-sm font-medium mb-2 md:mb-0 hidden md:inline-flex'>
            Attachments:
          </p>
          <div className='flex flex-wrap gap-2'>
            {isUploading && (
              <div className='flex items-center gap-2 border rounded-md px-3 py-2 bg-background text-sm'>
                <p className='animate-pulse'>Uploading...</p>
              </div>
            )}

            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className='flex items-center gap-2 border border-blue-500 rounded-md px-3 py-2 bg-background text-sm group'
              >
                <span className='bg-[#D1E9FF] rounded-full p-1'>
                  <IoDocumentOutline className='h-4 w-4 text-blue-500' />
                </span>
                <span className='max-w-[200px] truncate'>
                  {attachment.name}
                </span>
                <FaCheckCircle className='h-4 w-4 text-blue-500' />
                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className='opacity-0 group-hover:opacity-100 transition-opacity ml-1'
                >
                  <X className='h-4 w-4 text-muted-foreground hover:text-foreground' />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className='order-2 md:order-1 relative flex items-start gap-2'>
        <div className='flex-1 relative'>
          <Textarea
            placeholder='Write message here'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className='h-[128px] resize-none pr-4 py-3 rounded-xl border bg-background focus-visible:ring-0'
            disabled={isSending}
          />
        </div>

        <div className='flex flex-col gap-2'>
          <Button
            variant='outline'
            size='icon'
            className='rounded-xl h-12 w-12 border-muted'
            onClick={handleAttachmentClick}
            disabled={isSending}
          >
            <Paperclip className='h-5 w-5' />
          </Button>

          <Button
            size='icon'
            className='rounded-xl h-12 w-12 link-btn cursor-pointer'
            onClick={handleSendMessage}
            disabled={isSending}
          >
            <Send className='h-5 w-5' />
          </Button>
        </div>

        <input
          type='file'
          ref={fileInputRef}
          onChange={handleFileChange}
          className='hidden'
          accept='.txt,.pdf,.docx,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        />
      </div>
    </div>
  );
}
