// app\(main)\chat\components\ChatSection.jsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Send, Sparkles } from "lucide-react";
import { IoSend } from "react-icons/io5";
import { RiSparkling2Line } from "react-icons/ri";
import ChatCard from "./ChatCard";
import ChatInputField from "./ChatInputField";

export default function ChatSection() {
  const show = false;
  return (
    <section className="flex-1 p-1 lg:p-8 max-h-[81vh] h-screen rounded-[20px]">
      <div className="mx-auto h-full">
        {/* Logo and Welcome */}
        {show ? (
          <div className="flex flex-col h-full justify-between">
            <div className="text-center mb-8 mt-24">
              <h1 className="text-4xl font-bold mb-1">Inbox-Buddy.AI</h1>
              <p className="text-gray-500">Your email assistant</p>
              <h2 className="text-xl font-semibold mt-4">
                Welcome Konstantin!
              </h2>
              <div className="max-w-md text-center mx-auto space-y-4">
                {/* <h2 className="text-2xl font-semibold text-center">
                What can I help with?
              </h2> */}
                {/* <h2 className="text-2xl font-bold">
                Welcome to AI Email Assistant
              </h2> */}
                <p className="text-muted-foreground">
                  I can help you manage your emails, draft responses, find
                  specific messages, and more. Just ask me anything!
                </p>
                <div className="text-sm text-muted-foreground">
                  Try asking:
                  <ul className="mt-2 space-y-2">
                    <li>"Show my unread emails"</li>
                    <li>"Find emails from [sender]"</li>
                    <li>"Draft a response to [subject]"</li>
                    <li>"Summarize my recent emails"</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* <Separator className="mb-4 w-full" /> */}

            {/* <div className="mt-16 text-center flex flex-col items-center justify-center">
              <h2 className="text-4xl font-semibold">What can I help with?</h2>
              <div className="mt-8 max-w-2xl w-full">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <RiSparkling2Line size={18} className="text-[#101010]" />
                  </div>
                  <Input
                    className="pl-10 pr-12 py-6 w-full bg-white rounded-lg border focus-visible:border-ring focus-visible:ring-[#101010] focus-visible:ring-[1px] placeholder:text-[#101010]"
                    placeholder="Ask Your Question"
                  />
                  <Button
                    className="absolute cursor-pointer inset-y-0 right-0 top-2 flex items-center pr-3 text-[#101010] hover:bg-transparent"
                    variant="ghost"
                  >
                    <IoSend size={20} />
                  </Button>
                </div>
              </div>
            </div> */}
            <ChatInputField />
          </div>
        ) : (
          // Message Blocks
          <div className="flex flex-col justify-between h-full">
            <div className="space-y-6 overflow-auto flex flex-col messages">
              {/* user message */}
              <ChatCard senderUser={true} />

              {/* chat message */}
              <ChatCard />
            </div>

            {/* Question Input */}
            {/* <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <RiSparkling2Line size={18} className="text-[#101010]" />
              </div>
              <Input
                className="pl-10 pr-12 py-7 w-full bg-white rounded-lg border focus-visible:border-ring focus-visible:ring-[#101010] focus-visible:ring-[1px] placeholder:text-[#101010]"
                placeholder="Ask Your Question"
              />
              <Button
                className="absolute cursor-pointer inset-y-0 right-0 top-3 flex items-center pr-3 text-[#101010] hover:bg-transparent"
                variant="ghost"
              >
                <IoSend size={20} />
              </Button>
            </div> */}
            <ChatInputField />
          </div>
        )}

        {/* {!show && } */}
      </div>
    </section>
  );
}

{
  /* user message */
}
{
  /* <div className="flex justify-end">
                <Card className="bg-[#E6E6E6] p-4 w-fit shadow-none border-none">
                  <p className="text-[#101010]">
                    The Bible's main message can be understood as God's plan for
                    redemption and reconciliation with humanity. At its core, it
                    tells the story of
                  </p>
                </Card>
              </div> */
}

{
  /* bot message */
}
{
  /* <Card className="bg-transparent p-4 shadow-none border-none"> */
}
{
  /* <p className="text-[#434343]">
                The Bible's main message can be understood as God's plan for
                redemption and reconciliation with humanity. At its core, it
                tells the story of The Bible's main message can be understood as
                God's plan for redemption and reconciliation with humanity. At
                its core, it tells the story of The Bible's main message can be
                understood as God's plan for redemption and reconciliation with
                humanity.
              </p> */
}
{
  /* </Card> */
}
