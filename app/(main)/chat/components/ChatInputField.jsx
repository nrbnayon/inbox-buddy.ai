"use client";
import React, { useRef, useState } from "react";
import { useChat } from "./ChatContext";
import { sendChatMessage } from "@/lib/api/chat";

export default function ChatInputField() {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const { addMessage, setIsTyping, selectedModel, messages } = useChat();

  const handleSendMessage = async () => {
    if (!message.trim() && attachments.length === 0) return;

    const userMessage = {
      role: "user",
      message,
      timestamp: new Date(),
      attachments,
    };

    addMessage(userMessage);
    setMessage("");
    setAttachments([]);
    setIsTyping(true);

    try {
      // Get the model ID from selectedModel
      const modelId = selectedModel?.id || selectedModel?.value;
      console.log("Selected model for message:", selectedModel);
      console.log("Using model ID:", modelId);

      // We won't send chat history from the frontend
      // Let the backend manage its own history

      // Send the message directly with all parameters
      const response = await sendChatMessage(
        message,
        attachments.length > 0 ? attachments[0].file : null,
        modelId
      );

      const assistantMessage = {
        role: "assistant",
        message: response.message,
        timestamp: new Date(),
      };

      addMessage(assistantMessage);
    } catch (error) {
      console.error("Failed to send message:", error);
      addMessage({
        role: "assistant",
        message: "Sorry, there was an error processing your message.",
        timestamp: new Date(),
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(
      files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        file,
      }))
    );
    fileInputRef.current.value = "";
  };

  return (
    <div className='flex flex-col gap-4'>
      {attachments.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {attachments.map((file, index) => (
            <div
              key={index}
              className='flex items-center gap-2 bg-gray-100 rounded px-3 py-1'
            >
              <span>📎 {file.name}</span>
              <button
                onClick={() =>
                  setAttachments((prev) => prev.filter((_, i) => i !== index))
                }
                className='text-red-500 hover:text-red-700'
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className='flex items-end gap-2'>
        <div className='flex-1'>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder='Type your message...'
            className='w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
            rows={3}
          />
        </div>

        <div className='flex gap-2'>
          <button
            onClick={() => fileInputRef.current.click()}
            className='p-3 rounded-lg border hover:bg-gray-50'
          >
            📎
          </button>
          <button
            onClick={handleSendMessage}
            className='bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600'
          >
            Send
          </button>
        </div>

        <input
          type='file'
          ref={fileInputRef}
          onChange={handleFileChange}
          className='hidden'
          multiple
        />
      </div>
    </div>
  );
}
