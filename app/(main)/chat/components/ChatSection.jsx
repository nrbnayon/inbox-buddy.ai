"use client";

import { useEffect, useState } from "react";
import { useChat } from "./ChatContext";
import { getUserProfile } from "@/lib/api/user";
import ChatMessages from "./ChatMessages";
import ChatInputField from "./ChatInputField";
import LoadingPing from "@/components/LoadingPing";
import ChatHeader from "./ChatHeader";

export default function ChatSection() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { messages } = useChat();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user profile:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <LoadingPing />;

  return (
    <section className='w-full max-h-screen'>
      <ChatHeader />
      <div className='mx-auto h-full flex flex-col'>
        <div className='flex-1 overflow-auto'>
          {messages.length === 0 ? (
            <div className='text-center mb-8 mt-24'>
              <h1 className='text-4xl font-bold mb-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                Inbox-Buddy.AI
              </h1>
              <p className='text-gray-500'>Your email assistant</p>
              <h2 className='text-xl font-semibold mt-4'>
                Welcome {userData?.data?.name || "Nayon Kanti Halder"}!
              </h2>
              <div className='max-w-md text-center mx-auto space-y-4'>
                <p className='text-muted-foreground'>
                  I can help you manage your emails, draft responses, find
                  specific messages, and more. Just ask me anything!
                </p>
                <div className='text-sm text-muted-foreground'>
                  Try asking:
                  <ul className='mt-1 space-y-2'>
                    <li className='group cursor-pointer transition-all duration-200 hover:bg-blue-100 hover:text-blue-800  rounded-lg hover:shadow-md'>
                      "Show my unread emails"
                    </li>
                    <li className='group cursor-pointer transition-all duration-200 hover:bg-blue-100 hover:text-blue-800  rounded-lg hover:shadow-md'>
                      "Find emails from [sender]"
                    </li>
                    <li className='group cursor-pointer transition-all duration-200 hover:bg-blue-100 hover:text-blue-800  rounded-lg hover:shadow-md'>
                      "Draft a response to [subject]"
                    </li>
                    <li className='group cursor-pointer transition-all duration-200 hover:bg-blue-100 hover:text-blue-800  rounded-lg hover:shadow-md'>
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
        <div className='mt-auto'>
          <ChatInputField />
        </div>
      </div>
    </section>
  );
}
