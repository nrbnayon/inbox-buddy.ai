// app\(main)\chat\components\ChatCard.jsx
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FaCheckCircle } from "react-icons/fa";
import { IoDocumentOutline } from "react-icons/io5";
import { cn } from "@/lib/utils";

export default function ChatCard({
  userName = "Hamid R Mousazade",
  userRole = "User",
  avatarUrl = "https://images.pexels.com/photos/2834009/pexels-photo-2834009.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  date = "July 22, 2024 - 03:00pm",
  message = "Hi Inbox-Buddy! Can you summarise this doc for me and provide context to the discussion?",
  attachments = [
    { name: "Invoice-Version-2.pdf", type: "pdf", isSelected: true },
  ],
  senderUser,
  className,
}) {
  return (
    <Card className={cn("w-full gap-2 py-5 shadow-none", className)}>
      <CardContent>
        <div className="flex flex-col space-y-4">
          {/* Header with user info and date */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={avatarUrl} alt={userName} />
                <AvatarFallback>{userName.slice(0, 2)}</AvatarFallback>
              </Avatar>
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
              {date}
            </span>
          </div>

          {/* Message content */}
          <div className="py-2">
            <span className="text-sm sm:text-base block">{message}</span>
          </div>
        </div>
      </CardContent>

      {senderUser && attachments && attachments.length > 0 && (
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
                    {attachment.isSelected && (
                      <FaCheckCircle className="h-4 w-4 text-blue-500 ml-1" />
                    )}
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