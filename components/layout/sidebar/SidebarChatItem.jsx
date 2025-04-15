"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { updateChatById, deleteChatById } from "@/app/actions/chatActions"; // Import deleteChatById
import SmallLoader from "@/components/SmallLoader";
import { toast } from "sonner";
import { useChat } from "@/app/(main)/contexts/ChatContext";
import { useRouter } from "next/navigation";

const SidebarChatItem = ({
  chat,
  pathName,
  openDropdowns,
  setOpenDropdowns,
  isMobile,
  setIsOpen,
}) => {
  const chatId = isMobile ? `mobile-${chat._id}` : chat._id;

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newChatName, setNewChatName] = useState(chat.name);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const router = useRouter();

  const { setChats } = useChat();

  const openEdit = () => {
    setSelectedChatId(chat._id);
    setNewChatName(chat.name);
    setShowEditModal(true);
  };

  const openDelete = () => {
    setSelectedChatId(chat._id);
    setShowDeleteModal(true);
  };

  const handleUpdate = async () => {
    if (!newChatName.trim()) {
      toast.info("Chat name cannot be empty");
      return;
    }

    setUpdateLoading(true);
    try {
      const res = await updateChatById(selectedChatId, newChatName);
      if (res?.success) {
        // Update the chat in the state
        setChats((prevChats) =>
          prevChats.map((c) =>
            c._id === selectedChatId ? { ...c, name: newChatName } : c
          )
        );
        setShowEditModal(false);
        if (isMobile && setIsOpen) setIsOpen(false);
        setOpenDropdowns((prev) => ({ ...prev, [chatId]: false })); // Close dropdown
        toast.success("Chat Name Updated.");
      } else {
        throw new Error(res?.message || "Failed to update chat");
      }
    } catch (error) {
      console.error("Failed to update chat:", error);
      toast.error(error.message || "Failed to update chat. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await deleteChatById(selectedChatId);
      if (res?.success) {
        // Remove the chat from the state
        setChats((prevChats) =>
          prevChats.filter((c) => c._id !== selectedChatId)
        );
        setShowDeleteModal(false);
        if (isMobile && setIsOpen) setIsOpen(false);
        setOpenDropdowns((prev) => ({ ...prev, [chatId]: false })); // Close dropdown
        toast.success("Chat Deleted.");
        router.push("/chat");
      } else {
        throw new Error(res?.message || "Failed to delete chat");
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
      toast.error(error.message || "Failed to delete chat. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
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
            <span>
              {chat.name.length > 15
                ? `${chat.name.slice(0, 15)}...`
                : chat.name}
            </span>
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
                      ? "opacity-100" // Always visible on mobile
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
                    e.stopPropagation(); // Prevent closing
                    openEdit();
                    setOpenDropdowns((prev) => ({ ...prev, [chatId]: false })); // Close dropdown
                  }}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation(); // Prevent closing
                    openDelete();
                    setOpenDropdowns((prev) => ({ ...prev, [chatId]: false })); // Close dropdown
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Link>
      </div>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Chat Name</DialogTitle>
          </DialogHeader>
          <Input
            value={newChatName}
            onChange={(e) => setNewChatName(e.target.value)}
            placeholder="Enter new chat name"
          />
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button
              variant="blueGradient"
              onClick={handleUpdate}
              disabled={updateLoading}
            >
              {updateLoading ? <SmallLoader /> : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this chat?</p>
          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? <SmallLoader /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SidebarChatItem;
