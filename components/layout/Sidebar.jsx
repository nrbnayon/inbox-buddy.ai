"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { GrLogout } from "react-icons/gr";
import { MdOutlineDashboard } from "react-icons/md";
import { MdOutlineChatBubbleOutline } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
// import ChatHeader from "@/app/(main)/chat/components/ChatHeader";
import { usePathname, useRouter } from "next/navigation";
import { logoutAction } from "@/app/actions/authActions";
import { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import logoImage from "@/public/Frame 2.svg";
import Image from "next/image";
import ProfileModal from "../modals/ProfileModal";
import useGetUser from "@/hooks/useGetUser";
import { Plus, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChat } from "@/app/(main)/contexts/ChatContext";
// import ChatHeader from "@/app/(main)/chat/components/ChatHeader";

const navLinks = [
  {
    path: "/dashboard",
    icon: MdOutlineDashboard,
    label: "Dashboard",
  },
  {
    path: "/chat",
    icon: MdOutlineChatBubbleOutline,
    label: "Chat",
    isChat: true,
  },
  // {
  //   path: "#",
  //   icon: RiSettings2Line,
  //   label: "Your Apps",
  // },
];

// Sample previous chats - in a real app, this would come from an API or state
// const previousChats = [
//   { id: "1", path: "/chat/previous-1", label: "Previous Chat 1" },
//   { id: "2", path: "/chat/previous-2", label: "Previous Chat 2" },
//   { id: "3", path: "/chat/previous-3", label: "Previous Chat 3" },
// ];

const publicRoutes = ["/", "/about", "/connect", "/pricing", "/team", "/login"];

const Sidebar = ({ children, accessToken, previousChats }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { user } = useGetUser(accessToken);
  const pathName = usePathname();
  const router = useRouter();
  const [openDropdowns, setOpenDropdowns] = useState({});
  const { chats, setChats } = useChat();

  // Ensure the image source is an absolute URL
  // const imageSrc =
  //   user?.image && user.image.length > 2
  //     ? `http://192.168.10.33:4000/uploads/images/${user.image}`
  //     : user?.profilePicture || "";

  useEffect(() => {
    if (previousChats) {
      setChats(previousChats);
    }
  }, [previousChats]);

  const imageSrc = user?.profilePicture;

  const handleLogout = async () => {
    await logoutAction();
    router.push("/");
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
    setIsOpen(false);
  };

  const handleNewChat = () => {
    router.push("/chat/new");
  };

  const handleEditChat = (id) => {
    console.log("Edit chat:", id);
    // Implement edit functionality
  };

  const handleDeleteChat = (id) => {
    console.log("Delete chat:", id);
    // Implement delete functionality
  };

  if (publicRoutes.includes(pathName)) {
    return children;
  }

  return (
    <div className="flex h-screen w-full">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-64 lg:shrink-0 lg:bg-[#F1F1F1] dark:lg:bg-gray-800">
        <div className="flex h-full flex-col justify-between py-6 px-4">
          <div className="space-y-6">
            <button
              onClick={openProfileModal}
              className="flex items-center gap-3 font-bold w-full text-left"
            >
              {/* Log the src just before rendering */}
              <Avatar>
                <AvatarImage src={imageSrc} alt={user?.name} />
                <AvatarFallback className="bg-gradient-to-r from-[#00ACDA] to-[#43D4FB] text-sm">
                  {user?.name?.charAt(0) || "N/A"}
                </AvatarFallback>
              </Avatar>
              {/* <Image
                src={imageSrc || "/placeholder.svg"}
                alt="profile picture"
                width={100}
                height={100}
              /> */}
              <div>
                <h4 className="font-semibold text-[20px]">
                  {user?.name || "N/A"}
                </h4>
                <span className="text-xs font-light text-[#101010]">
                  {user?.email || "N/A"}
                </span>
              </div>
            </button>
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
                    <div className="pl-8 space-y-1 mt-1">
                      {chats.map((chat) => (
                        <div
                          key={chat._id}
                          className="flex items-center justify-between group"
                        >
                          <Link
                            href={`/chat/${chat?._id}`}
                            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50 ${
                              pathName === `/chat/${chat?._id}` && "link-btn"
                            }`}
                            prefetch={false}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span>{chat.name}</span>
                              <DropdownMenu
                                open={openDropdowns[chat._id]}
                                onOpenChange={(open) => {
                                  setOpenDropdowns((prev) => ({
                                    ...prev,
                                    [chat._id]: open,
                                  }));
                                }}
                              >
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`p-1 h-auto hover:bg-transparent ${
                                      openDropdowns[chat._id]
                                        ? "opacity-100"
                                        : "opacity-0 group-hover:opacity-100"
                                    }`}
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    <MoreHorizontal size={14} />
                                    <span className="sr-only">
                                      More options
                                    </span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-36"
                                >
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleEditChat(chat._id);
                                    }}
                                  >
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleDeleteChat(chat._id);
                                    }}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </Link>
                        </div>
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
                <div className="flex h-full flex-col justify-between py-6 px-4 mt-4">
                  <div className="space-y-6">
                    <button
                      onClick={openProfileModal}
                      className="flex items-center gap-3 font-bold w-full text-left mb-4"
                    >
                      {/* Log the src just before rendering */}
                      <Avatar>
                        <AvatarImage src={imageSrc} alt={user?.name} />
                        <AvatarFallback className="bg-gradient-to-r from-[#00ACDA] to-[#43D4FB] text-sm">
                          {user?.name?.charAt(0) || "N/A"}
                        </AvatarFallback>
                      </Avatar>
                      {/* <Image
                        src={imageSrc || "/placeholder.svg"}
                        alt="profile picture"
                        width={100}
                        height={100}
                      /> */}
                      <div>
                        <h4 className="font-semibold text-[18px]">
                          {user?.name || "N/A"}
                        </h4>
                        <span className="text-xs font-light text-[#101010]">
                          {user?.email || "N/A"}
                        </span>
                      </div>
                    </button>
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
                            onClick={() =>
                              link.isChat ? null : setIsOpen(false)
                            }
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
                                <div
                                  key={chat._id}
                                  className="flex items-center justify-between group"
                                >
                                  <Link
                                    href={`/chat/${chat?._id}`}
                                    className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50 ${
                                      pathName === chat.path && "link-btn"
                                    }`}
                                    prefetch={false}
                                    onClick={() => setIsOpen(false)}
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <span>{chat.name}</span>
                                      <DropdownMenu
                                        open={
                                          openDropdowns[`mobile-${chat._id}`]
                                        }
                                        onOpenChange={(open) => {
                                          setOpenDropdowns((prev) => ({
                                            ...prev,
                                            [`mobile-${chat._id}`]: open,
                                          }));
                                        }}
                                      >
                                        <DropdownMenuTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`p-1 h-auto hover:bg-transparent ${
                                              openDropdowns[
                                                `mobile-${chat._id}`
                                              ]
                                                ? "opacity-100"
                                                : ""
                                            }`}
                                            onClick={(e) => e.preventDefault()}
                                          >
                                            <MoreHorizontal size={14} />
                                            <span className="sr-only">
                                              More options
                                            </span>
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                          align="end"
                                          className="w-36"
                                        >
                                          <DropdownMenuItem
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handleEditChat(chat._id);
                                              setIsOpen(false);
                                            }}
                                          >
                                            Edit
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handleDeleteChat(chat._id);
                                              setIsOpen(false);
                                            }}
                                          >
                                            Delete
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </Link>
                                </div>
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
