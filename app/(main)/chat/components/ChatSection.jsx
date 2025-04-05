// app\(main)\chat\components\ChatSection.jsx
"use client";

import { useEffect, useState } from "react";
import { getUserProfile } from "@/lib/api/user";
import ChatCard from "./ChatCard";
import ChatInputField from "./ChatInputField";
import LoadingPing from "@/components/LoadingPing";

export default function ChatSection() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const show = true;

  if (loading) return <LoadingPing />;

  return (
    <section className='flex-1 p-1 lg:p-8 max-h-[81vh] h-screen rounded-[20px]'>
      <div className='mx-auto h-full'>
        {/* Logo and Welcome */}
        {show ? (
          <div className='flex flex-col h-full justify-between'>
            <div className='text-center mb-8 mt-24'>
              <h1 className='text-4xl font-bold mb-1'>Inbox-Buddy.AI</h1>
              <p className='text-gray-500'>Your email assistant</p>
              <h2 className='text-xl font-semibold mt-4'>
                Welcome {userData?.data?.name || "User"}!
              </h2>
              <div className='max-w-md text-center mx-auto space-y-4'>
                <p className='text-muted-foreground'>
                  I can help you manage your emails, draft responses, find
                  specific messages, and more. Just ask me anything!
                </p>
                <div className='text-sm text-muted-foreground'>
                  Try asking:
                  <ul className='mt-2 space-y-2'>
                    <li>"Show my unread emails"</li>
                    <li>"Find emails from [sender]"</li>
                    <li>"Draft a response to [subject]"</li>
                    <li>"Summarize my recent emails"</li>
                  </ul>
                </div>
              </div>
            </div>
            <ChatInputField />
          </div>
        ) : (
          // Message Blocks
          <div className='flex flex-col justify-between h-full'>
            <div className='space-y-6 overflow-auto flex flex-col messages'>
              {/* user message */}
              <ChatCard senderUser={true} />

              {/* chat message */}
              <ChatCard />
            </div>
            <ChatInputField />
          </div>
        )}
      </div>
    </section>
  );
}
