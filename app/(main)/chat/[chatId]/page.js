// app\(main)\chat\[chatId]\page.js
import { cookies } from "next/headers";
import { getChatById } from "@/app/actions/chatActions";
import Link from "next/link";
import ChatSection from "../components/ChatSection";

export default async function SingleChatPage({ params }) {
  const cookieStore = await cookies();
  const { chatId } = await params;

  const accessToken = cookieStore.get("accessToken")?.value;

  let msgsFromDb;
  let chatNotFound = false;

  if (chatId) {
    try {
      const res = await getChatById(chatId);
      if (res.status === 404 || res.code === "ERR_BAD_REQUEST") {
        chatNotFound = true;
      } else {
        msgsFromDb = res?.data?.data?.messages;
      }
    } catch (error) {
      chatNotFound = true;
    }
  }

  if (chatNotFound) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center">
          <div className="mb-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto text-[#f94d41]"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 8V12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 16H12.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Chat not found</h1>
          <p className="text-gray-600 mb-8">
            The conversation you were looking for could not be found.
          </p>
          <Link
            href="/chat"
            className="bg-black text-white py-3 px-5 rounded-md font-medium"
          >
            Start a new chat
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ChatSection
      accessToken={accessToken}
      chatId={chatId}
      msgFromDb={msgsFromDb}
    />
  );
}
