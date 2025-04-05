"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { GrLogout } from "react-icons/gr";
import { MdOutlineDashboard } from "react-icons/md";
import { MdOutlineChatBubbleOutline } from "react-icons/md";
import { RiSettings2Line } from "react-icons/ri";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ChatHeader from "@/app/(main)/chat/components/ChatHeader";
import { usePathname, useRouter } from "next/navigation";
import { logoutAction } from "@/app/actions/authActions";
import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import logoImage from "@/public/Frame 2.svg";
import Image from "next/image";
import ProfileModal from "../modals/ProfileModal";

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
  },
  {
    path: "#",
    icon: RiSettings2Line,
    label: "Your Apps",
  },
];

const publicRoutes = [
  "/",
  "/about",
  "/connect",
  "/security",
  "/team",
  "/login",
];

const Sidebar = ({ children, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const pathName = usePathname();
  const router = useRouter();

  // Ensure the image source is an absolute URL
  const imageSrc =
    user?.image && user.image.length > 2
      ? `http://localhost:4000/uploads/images/${user.image}`
      : user?.profilePicture || "";

  const handleLogout = async () => {
    await logoutAction();
    router.push("/");
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
    setIsOpen(false);
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
              <Avatar>
                {/* Log the src just before rendering */}
                <AvatarImage src={imageSrc} alt={user?.name} />
                <AvatarFallback className="bg-gradient-to-r from-[#00ACDA] to-[#43D4FB] text-sm">
                  {user?.name?.charAt(0) || "N/A"}
                </AvatarFallback>
              </Avatar>
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
                <Link
                  key={link.label}
                  href={link.path}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50 ${
                    pathName === link.path && "link-btn"
                  }`}
                  prefetch={false}
                >
                  <span className="bg-white p-[6px] flex justify-center items-center rounded-full">
                    <link.icon size={16} color="#101010" />
                  </span>
                  {link.label}
                </Link>
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
            <Link href="#" className="flex items-center gap-2 font-bold" prefetch={false}>
              <Image src={logoImage} alt="Index Ai Logo" className="w-40 lg:w-fit" />
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
                      <Avatar>
                        {/* Log the src just before rendering */}
                        <AvatarImage src={imageSrc} alt={user?.name} />
                        <AvatarFallback className="bg-gradient-to-r from-[#00ACDA] to-[#43D4FB] text-sm">
                          {user?.name?.charAt(0) || "N/A"}
                        </AvatarFallback>
                      </Avatar>
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
                        <Link
                          key={link.label}
                          href={link.path}
                          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50 ${
                            pathName === link.path && "link-btn"
                          }`}
                          prefetch={false}
                          onClick={() => setIsOpen(false)}
                        >
                          <span className="bg-white p-[6px] flex justify-center items-center rounded-full">
                            <link.icon size={16} color="#101010" />
                          </span>
                          {link.label}
                        </Link>
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
        <section className="p-2 pb-0 md:p-10 md:pb-0">
          {pathName === "/chat" && <ChatHeader />}
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