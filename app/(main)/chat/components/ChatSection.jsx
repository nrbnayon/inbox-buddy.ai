"use client";

import { useEffect, useState } from "react";
import { useChat } from "../../contexts/ChatContext";
import { getUserProfile } from "@/lib/api/user";
import ChatMessages from "./ChatMessages";
import ChatInputField from "./ChatInputField";
import LoadingPing from "@/components/LoadingPing";
import ChatHeader from "./ChatHeader";
import logoImage from "@/public/bot.png";
import Image from "next/image";

export default function ChatSection({
  accessToken,
  chatId,
  msgFromDb,
  userData,
}) {
  // const [loading, setLoading] = useState(true);
  const { messages, setMessages, clearMessages, isTyping } = useChat();

  useEffect(() => {
    if (msgFromDb) {
      setMessages(msgFromDb);
    }

    return () => {
      setMessages([]);
    };
  }, [msgFromDb]);

  // if (loading) return <LoadingPing />;

  return (
    <section className="w-full max-h-[100vh] h-full flex flex-col overflow-hidden">
      {/* Chat Header - Fixed at the top */}
      <ChatHeader accessToken={accessToken} />

      {/* Main chat area - Takes remaining height */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Messages - Scrollable area with fixed height */}
        <div className="flex-1 overflow-y-auto messages">
          {messages.length === 0 ? (
            // <div className="text-center mt-24">
            //   <h1 className="text-4xl font-bold mb-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            //     Inbox-Buddy.AI
            //   </h1>
            //   <p className="text-gray-500">Your email assistant</p>
            //   <h2 className="text-xl font-semibold mt-4">
            //     Welcome {userData?.name || "Nayon Kanti Halder"}!
            //   </h2>
            //   <div className="max-w-md text-center mx-auto space-y-4">
            //     <p className="text-muted-foreground">
            //       I can help you manage your emails, draft responses, find
            //       specific messages, and more. Just ask me anything!
            //     </p>
            //     <div className="text-sm text-muted-foreground">
            //       Try asking:
            //       <ul className="mt-1 space-y-2">
            //         <li className="group cursor-pointer transition-all duration-200 hover:bg-blue-100 hover:text-blue-800 rounded-lg hover:shadow-md">
            //           "Show my unread emails"
            //         </li>
            //         <li className="group cursor-pointer transition-all duration-200 hover:bg-blue-100 hover:text-blue-800 rounded-lg hover:shadow-md">
            //           "Find emails from [sender]"
            //         </li>
            //         <li className="group cursor-pointer transition-all duration-200 hover:bg-blue-100 hover:text-blue-800 rounded-lg hover:shadow-md">
            //           "Draft a response to [subject]"
            //         </li>
            //         <li className="group cursor-pointer transition-all duration-200 hover:bg-blue-100 hover:text-blue-800 rounded-lg hover:shadow-md">
            //           "Summarize my recent emails"
            //         </li>
            //       </ul>
            //     </div>
            //   </div>
            // </div>
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4 max-w-md p-8">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  {/* <Bot size={24} className="text-primary" /> */}
                  <Image
                    src={logoImage}
                    alt="Index Ai Logo"
                    className="w-40 lg:w-fit mx-auto"
                  />
                </div>
                <h3 className="text-xl font-semibold">
                  Your Email AI Assistant
                </h3>

                <p className="text-muted-foreground">Hi, {userData.name}</p>

                <p className="text-muted-foreground">
                  I&apos;m your inbox buddy. What can I help you out with today?
                </p>

                {/* <p className="text-muted-foreground">
                  I can help you manage your emails, answer questions, and
                  provide insights about your inbox.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    "Summarize my unread emails"
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    "Draft a response to the latest email from John"
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    "Find all emails about the marketing campaign"
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    "What's my email activity this week?"
                  </div>
                </div> */}
              </div>
            </div>
          ) : (
            <ChatMessages userData={userData} />
          )}
        </div>

        {/* Chat Input Field - Fixed at the bottom */}
        <div className="mt-auto p-4 mb-6 bg-white">
          <ChatInputField chatId={chatId} />
          {/* {messages?.length > 0 && (
            <div className="flex justify-end mb-2 absolute top-50 -right-10 rotate-90">
              <Button
                variant="delete"
                disabled={isTyping}
                className="w-fit disabled:cursor-not-allowed"
                onClick={() => clearMessages()}
              >
                X clear chats
              </Button>
            </div>
          )} */}
        </div>
      </div>
    </section>
  );
}
