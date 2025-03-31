// app\(main)\chat\components\ChatInputField.jsx
"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, X } from "lucide-react";
import { FaCheckCircle } from "react-icons/fa";
import { IoDocumentOutline } from "react-icons/io5";

export default function ChatInputField() {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setIsUploading(true);

      // Simulate upload delay
      setTimeout(() => {
        const newAttachments = files.map((file) => ({
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          file,
        }));

        setAttachments((prev) => [...prev, ...newAttachments]);
        setIsUploading(false);

        // Reset the file input value to allow re-selecting the same file
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 1000);
    }
  };

  const removeAttachment = (id) => {
    setAttachments(attachments.filter((attachment) => attachment.id !== id));
    // Reset the file input value after removal
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = () => {
    if (message.trim() || attachments.length > 0) {
      console.log("Sending message:", message);
      console.log("With attachments:", attachments);

      // Reset form after sending
      setMessage("");
      setAttachments([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
      {/* Attachments section */}
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

      {/* Message input area */}
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

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl h-12 w-12 border-muted"
            onClick={handleAttachmentClick}
          >
            <Paperclip className="h-5 w-5" />
            <span className="sr-only">Attach file</span>
          </Button>

          <Button
            size="icon"
            className="rounded-xl h-12 w-12 link-btn cursor-pointer"
            onClick={handleSendMessage}
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>

        {/* Hidden file input */}
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
