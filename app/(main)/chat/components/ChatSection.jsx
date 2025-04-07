"use client";

import { useEffect, useState } from "react";
import { useChat } from "./ChatContext";
import { getUserProfile } from "@/lib/api/user";
import ChatMessages from "./ChatMessages";
import ChatInputField from "./ChatInputField";
import LoadingPing from "@/components/LoadingPing";
import ChatHeader from "./ChatHeader";
import { Button } from "@/components/ui/button";

export default function ChatSection({ accessToken }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { messages, clearMessages, isTyping } = useChat();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(accessToken);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user profile:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [accessToken]);

  if (loading) return <LoadingPing />;

  return (
    <section className="w-full min-h-screen max-h-screen flex flex-col overflow-hidden">
      {/* Chat Header - Fixed at the top */}
      <ChatHeader />

      {/* Main chat area - Takes remaining height */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Messages - Scrollable area with fixed height */}
        <div className="flex-1 overflow-y-auto messages">
          {messages.length === 0 ? (
            <div className="text-center mt-24">
              <h1 className="text-4xl font-bold mb-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Inbox-Buddy.AI
              </h1>
              <p className="text-gray-500">Your email assistant</p>
              <h2 className="text-xl font-semibold mt-4">
                Welcome {userData?.data?.name || "Nayon Kanti Halder"}!
              </h2>
              <div className="max-w-md text-center mx-auto space-y-4">
                <p className="text-muted-foreground">
                  I can help you manage your emails, draft responses, find
                  specific messages, and more. Just ask me anything!
                </p>
                <div className="text-sm text-muted-foreground">
                  Try asking:
                  <ul className="mt-1 space-y-2">
                    <li className="group cursor-pointer transition-all duration-200 hover:bg-blue-100 hover:text-blue-800 rounded-lg hover:shadow-md">
                      "Show my unread emails"
                    </li>
                    <li className="group cursor-pointer transition-all duration-200 hover:bg-blue-100 hover:text-blue-800 rounded-lg hover:shadow-md">
                      "Find emails from [sender]"
                    </li>
                    <li className="group cursor-pointer transition-all duration-200 hover:bg-blue-100 hover:text-blue-800 rounded-lg hover:shadow-md">
                      "Draft a response to [subject]"
                    </li>
                    <li className="group cursor-pointer transition-all duration-200 hover:bg-blue-100 hover:text-blue-800 rounded-lg hover:shadow-md">
                      "Summarize my recent emails"
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <ChatMessages />
          )}
        </div>

        {/* Chat Input Field - Fixed at the bottom */}
        <div className="mt-auto p-4 mb-6 bg-white relative">
          <ChatInputField />
          {messages?.length > 0 && (
            <div className="flex justify-end mb-2 absolute top-0 left-[40%]">
              <Button
                variant="delete"
                disabled={isTyping}
                className="w-fit disabled:cursor-not-allowed"
                onClick={() => clearMessages()}
              >
                X clear chats
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
