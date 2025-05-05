"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FaCheckCircle } from "react-icons/fa";
import { IoDocumentOutline } from "react-icons/io5";
import { IoCopyOutline } from "react-icons/io5"; // Added copy icon
import { cn } from "@/lib/utils";
import Image from "next/image";
import chatAvatar from "@/public/bot.png";
import { formatDate } from "@/utils/timeutils";
import defaultUserImage from "@/public/defaultUser.jpg";
import { useState } from "react"; // Import useState for copy feedback

export default function ChatCard({
  userName = "User",
  userRole = "user",
  avatarUrl = defaultUserImage,
  date = "July 22, 2024 - 03:00pm",
  message = "Hi Inbox-Buddy! Can you summarize this doc for me and provide context to the discussion?",
  attachments = [],
  senderUser = false,
  className,
}) {
  const formattedDate = formatDate(date);
  const [copyText, setCopyText] = useState("Copy"); // State for copy button text

  // Function to handle copying the message
  const handleCopyMessage = () => {
    // Ensure message is a string before copying
    const textToCopy = typeof message === "string" ? message : String(message);

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopyText("Copied!");
        setTimeout(() => setCopyText("Copy"), 2000); // Reset after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy message: ", err);
        setCopyText("Failed to copy");
        setTimeout(() => setCopyText("Copy"), 2000);
      });
  };

  return (
    <Card className={cn("w-full gap-2 py-5 shadow-none", className)}>
      <CardContent>
        <div className="flex flex-col space-y-4">
          {/* Header with user info and date */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={senderUser ? avatarUrl : chatAvatar}
                alt={userName.slice(0, 1)}
                width={100}
                height={100}
                className="size-9 rounded-full"
              />
              <div>
                <h3 className="font-medium text-sm sm:text-base">{userName}</h3>
                <Badge
                  variant="outline"
                  className="text-xs font-normal px-2 py-0 bg-[#D1E9FF] text-[#175CD3]"
                >
                  {userRole}
                </Badge>
              </div>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
              {formattedDate}
            </span>
          </div>

          {/* Message content with copy button */}
          <div className="py-2 relative group">
            <div className="text-sm sm:text-base block">{message}</div>
            <button
              onClick={handleCopyMessage}
              className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-muted-foreground hover:text-primary px-2 py-1 rounded"
            >
              <IoCopyOutline className="h-4 w-4" />
              <span>{copyText}</span>
            </button>
          </div>
        </div>
      </CardContent>
      {/* Attachments (for user messages only) */}
      {senderUser && attachments.length > 0 && (
        <>
          <Separator />
          <CardFooter>
            <div className="w-full flex items-center gap-4">
              <span className="text-sm font-medium">Attachments:</span>
              <div className="flex flex-wrap gap-2">
                {attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 border border-[#2E90FA] rounded-md px-3 py-2 bg-background text-sm"
                  >
                    <span className="bg-[#D1E9FF] rounded-full p-1">
                      <IoDocumentOutline className="h-4 w-4 text-blue-500" />
                    </span>
                    <span>{attachment.name}</span>
                    <FaCheckCircle className="h-4 w-4 text-blue-500 ml-1" />
                  </div>
                ))}
              </div>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
