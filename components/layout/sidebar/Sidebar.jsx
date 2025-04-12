"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AiOutlineMenu } from "react-icons/ai";
import logoImage from "@/public/Frame 2.svg";
import { useChat } from "@/app/(main)/contexts/ChatContext";
import { logoutAction } from "@/app/actions/authActions";
import useGetUser from "@/hooks/useGetUser";

// Components
import DesktopSidebar from "./DesktopSidebar";
import MobileSidebarContent from "./MobileSidebar";

// Constants
import { publicRoutes } from "./SidebarConstants";
import ProfileModal from "@/components/modals/ProfileModal";
import { updateChatById } from "@/app/actions/chatActions";

const Sidebar = ({ children, accessToken, previousChats }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const { user } = useGetUser(accessToken);
  const pathName = usePathname();
  const router = useRouter();
  const { chats, setChats } = useChat();

  const imageSrc = user?.profilePicture;

  useEffect(() => {
    if (previousChats) {
      setChats(previousChats);
    }
  }, [previousChats, setChats]);

  const handleLogout = async () => {
    await logoutAction();
    router.push("/");
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
    setIsOpen(false);
  };

  const handleNewChat = () => {
    router.push("/chat");
  };

  const handleEditChat = async (id, newName) => {
    const res = await updateChatById(id, newName);

    console.log(res);
  };

  const handleDeleteChat = (id) => {
    console.log("Delete chat:", id);
  };

  // Shared props for both desktop and mobile sidebars
  const sidebarProps = {
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
  };

  if (publicRoutes.includes(pathName)) {
    return children;
  }

  return (
    <div className="flex h-screen w-full">
      {/* Desktop Sidebar */}
      <DesktopSidebar {...sidebarProps} />

      {/* Mobile Sidebar */}
      <div className="flex-1">
        <header className="sticky top-0 z-10 border-b bg-white px-2 md:px-4 py-3 dark:border-gray-800 dark:bg-gray-900 lg:hidden">
          <div className="flex items-center justify-between">
            <Link
              href="#"
              className="flex items-center gap-2 font-bold"
              prefetch={false}
            >
              <Image
                src={logoImage || "/placeholder.svg"}
                alt="Index Ai Logo"
                className="w-40 lg:w-fit"
              />
            </Link>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <AiOutlineMenu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <MobileSidebarContent {...sidebarProps} setIsOpen={setIsOpen} />
              </SheetContent>
            </Sheet>
          </div>
        </header>
        <section className="w-full h-screen overflow-hidden p-2 md:px-10">
          {/* {pathName === "/chat" && <ChatHeader />} */}
          {children}
        </section>
      </div>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        initialUser={user}
      />
    </div>
  );
};

export default Sidebar;
