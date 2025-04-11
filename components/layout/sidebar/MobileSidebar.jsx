"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GrLogout } from "react-icons/gr";
import { FaUserCircle } from "react-icons/fa";
import { Plus } from "lucide-react";
import { navLinks } from "./SidebarConstants";
import ChatItem from "./SidebarChatItems";
import UserProfile from "./SidebarUserProfile";

const MobileSidebar = ({
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
  setIsOpen,
}) => {
  return (
    <div className="flex h-full flex-col justify-between py-6 px-4 mt-4">
      <div className="space-y-6">
        <UserProfile
          user={user}
          imageSrc={imageSrc}
          openProfileModal={openProfileModal}
          className="mb-4"
        />

        <nav className="space-y-1">
          {navLinks.map((link) => (
            <div key={link.label}>
              {/* <div className="flex items-center justify-between"> */}
              <Link
                href={link.path}
                className={`flex justify-between items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50 ${
                  pathName === link.path && "link-btn"
                }`}
                prefetch={false}
                onClick={() => (link.isChat ? null : setIsOpen(false))}
              >
                <div className="flex gap-2 items-center">
                  <span className="bg-white p-[6px] flex justify-center items-center rounded-full">
                    <link.icon size={16} color="#101010" />
                  </span>
                  {link.label}
                </div>
                {link.isChat && (
                  <button
                    className="p-1 h-auto cursor-pointer"
                    onClick={() => {
                      handleNewChat();
                      setIsOpen(false);
                    }}
                    title="New Chat"
                  >
                    <Plus size={16} />
                    <span className="sr-only">New Chat</span>
                  </button>
                )}
              </Link>

              {/* Show sub chats directly under Chat for mobile */}
              {link.isChat && (
                <div className="pl-8 space-y-1 mt-1">
                  {chats.map((chat) => (
                    <ChatItem
                      key={chat._id}
                      chat={chat}
                      pathName={pathName}
                      openDropdowns={openDropdowns}
                      setOpenDropdowns={setOpenDropdowns}
                      handleEditChat={handleEditChat}
                      handleDeleteChat={handleDeleteChat}
                      isMobile={true}
                      setIsOpen={setIsOpen}
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
          onClick={openProfileModal}
          className="flex items-center gap-2 text-sm cursor-pointer"
          variant="ghost"
        >
          <FaUserCircle className="size-6" />
          <span>Profile</span>
        </Button>
        <Button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm cursor-pointer"
          variant="ghost"
        >
          <GrLogout className="size-6" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default MobileSidebar;
