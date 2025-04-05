import React from "react";
import { formatDistanceToNow } from "date-fns";

export default function ChatMessage({
  role,
  message,
  timestamp = new Date(),
  attachments = [],
}) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] ${
          isUser ? "bg-blue-500 text-white" : "bg-gray-100"
        } rounded-lg p-4`}
      >
        <div className='flex items-center gap-2 mb-2'>
          <div className='w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center'>
            {isUser ? "👤" : "🤖"}
          </div>
          <div>
            <div className='font-medium'>{isUser ? "You" : "AI Assistant"}</div>
            <div className='text-xs opacity-70'>
              {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
            </div>
          </div>
        </div>

        <div className='prose max-w-none'>
          {typeof message === "string" ? <p>{message}</p> : message}
        </div>

        {attachments.length > 0 && (
          <div className='mt-3 space-y-2'>
            <div className='text-sm font-medium'>Attachments:</div>
            <div className='flex flex-wrap gap-2'>
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className='flex items-center gap-2 bg-white/10 rounded px-3 py-1 text-sm'
                >
                  📎 {file.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
