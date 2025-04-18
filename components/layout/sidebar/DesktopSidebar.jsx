"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GrLogout } from "react-icons/gr";
import { FaUserCircle } from "react-icons/fa";
import { Plus } from "lucide-react";
import { navLinks } from "./SidebarConstants";
import SidebarChatItem from "./SidebarChatItem";
import UserProfile from "./SidebarUserProfile";
import { useChat } from "@/app/(main)/contexts/ChatContext";

const DesktopSidebar = ({
  user,
  imageSrc,
  pathName,
  chats,
  openDropdowns,
  setOpenDropdowns,
  handleNewChat,
  handleEditChat,
  handleDeleteChat,
  openProfileModal,
  handleLogout,
}) => {
  const { setMessages } = useChat();
  return (
    <div className="hidden lg:block lg:w-64 lg:shrink-0 lg:bg-[#F1F1F1] dark:lg:bg-gray-800">
      <div className="flex h-full flex-col justify-between py-6 px-4">
        <div className="space-y-6">
          <UserProfile
            user={user}
            imageSrc={imageSrc}
            openProfileModal={openProfileModal}
          />

          <nav className="space-y-1">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.path}
                  className={`flex justify-between items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50 ${
                    pathName === link.path && "link-btn"
                  }`}
                  prefetch={false}
                  onClick={() => link.isChat && setMessages([])}
                >
                  <div className="flex items-center gap-2">
                    <span className="bg-white p-[6px] flex justify-center items-center rounded-full">
                      <link.icon size={16} color="#101010" />
                    </span>
                    {link.label}
                  </div>
                  {link.isChat && (
                    <button
                      className="p-1 h-auto cursor-pointer"
                      onClick={handleNewChat}
                      title="New Chat"
                    >
                      <Plus size={16} />
                      <span className="sr-only">New Chat</span>
                    </button>
                  )}
                </Link>

                {/* Show sub chats directly under Chat */}
                {link.isChat && (
                  <div className="pl-8 space-y-1 mt-1 max-h-[500px] overflow-y-auto chat-container">
                    {chats.map((chat) => (
                      <SidebarChatItem
                        key={chat._id}
                        chat={chat}
                        pathName={pathName}
                        openDropdowns={openDropdowns}
                        setOpenDropdowns={setOpenDropdowns}
                        handleEditChat={handleEditChat}
                        handleDeleteChat={handleDeleteChat}
                        isMobile={false}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
        <div className="space-y-4">
          <Button
            className="flex items-center gap-2 text-sm cursor-pointer"
            variant="ghost"
            onClick={openProfileModal}
          >
            <FaUserCircle className="size-6" />
            <span>Profile</span>
          </Button>
          <Button
            className="flex items-center gap-2 text-sm cursor-pointer"
            variant="ghost"
            onClick={handleLogout}
          >
            <GrLogout className="size-6" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;
