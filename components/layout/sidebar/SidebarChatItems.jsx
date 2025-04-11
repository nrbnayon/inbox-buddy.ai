"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SidebarChatItems = ({
  chat,
  pathName,
  openDropdowns,
  setOpenDropdowns,
  handleEditChat,
  handleDeleteChat,
  isMobile,
  setIsOpen,
}) => {
  const chatId = isMobile ? `mobile-${chat._id}` : chat._id;

  return (
    <div className="flex items-center justify-between group">
      <Link
        href={`/chat/${chat?._id}`}
        className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50 ${
          pathName === `/chat/${chat?._id}` && "link-btn"
        }`}
        prefetch={false}
        onClick={() => isMobile && setIsOpen && setIsOpen(false)}
      >
        <div className="flex items-center justify-between w-full">
          <span>{chat.name}</span>
          <DropdownMenu
            open={openDropdowns[chatId]}
            onOpenChange={(open) => {
              setOpenDropdowns((prev) => ({
                ...prev,
                [chatId]: open,
              }));
            }}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`p-1 h-auto hover:bg-transparent ${
                  openDropdowns[chatId]
                    ? "opacity-100"
                    : isMobile
                    ? ""
                    : "opacity-0 group-hover:opacity-100"
                }`}
                onClick={(e) => e.preventDefault()}
              >
                <MoreHorizontal size={14} />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  handleEditChat(chat._id);
                  isMobile && setIsOpen && setIsOpen(false);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteChat(chat._id);
                  isMobile && setIsOpen && setIsOpen(false);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Link>
    </div>
  );
};

export default SidebarChatItems;
