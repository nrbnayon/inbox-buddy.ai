/**
 * v0 by Vercel.
 * @see https://v0.dev/t/4p67afrMzU1
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { GrLogout } from "react-icons/gr";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import { logoutAction } from "@/app/actions/authActions";
import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import logoImage from "@/public/Frame 2.svg";
import Image from "next/image";
import AdminHeader from "./AdminHeader";
import navLinks from "@/utils/navlinks";

const publicRoutes = [
  "/",
  "/about",
  "/connect",
  "/security",
  "/team",
  "/login",
];

export default function AdminSidebar({ children, user }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathName = usePathname();

  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();

    router.push("/");
  };

  if (publicRoutes.includes(pathName)) {
    return;
  }

  return (
    <div className="flex h-screen w-full">
      <div className="hidden lg:block lg:w-64 lg:shrink-0  lg:bg-[#F1F1F1] dark:lg:bg-gray-800">
        {/* pc sidbar */}
        <div className="flex h-full flex-col justify-between py-6 px-4 ">
          <div className="space-y-6">
            {/* sidebar header */}
            <Link
              href="#"
              className="flex items-center gap-3 font-bold"
              prefetch={false}
            >
              <Avatar>
                <AvatarImage src={user.profilePicture} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-r from-[#00ACDA] to-[#43D4FB] text-sm">
                  N/A
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold text-[20px]">
                  {user.name || "N/A"}
                </h4>
                <span className="text-xs font-light text-[#101010]">
                  {user.email || "N/A"}
                </span>
              </div>
            </Link>

            {/* sidebar links */}
            <nav className="space-y-1">
              {/* dashboard */}
              {navLinks?.map((link) => (
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

          {/* sidebar footer */}
          <div className="space-y-4">
            {/* <Button
              type="submit"
              className="flex w-full justify-center items-center gap-2 text-sm cursor-pointer bg-[#01A846] hover:bg-[#01A846]/80 py-8 rounded text-white"
              // variant="ghost"
              // onClick={handleLogout}
            >
              <IoMdShareAlt className="size-6" />
              <span>
                Refer a Friend, <br /> get one month free!
              </span>
            </Button> */}
            <Button
              type="submit"
              className="flex items-center gap-2 text-sm cursor-pointer"
              variant="ghost"
              onClick={() => console.log("to profile page")}
            >
              <FaUserCircle className="size-6" />
              <span>Profile</span>
            </Button>
            <Button
              type="submit"
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

      <div className="flex-1">
        {/* mobile sidebar */}
        <header className="sticky top-0 z-10 border-b bg-white px-2 md:px-4 py-3 dark:border-gray-800 dark:bg-gray-900 lg:hidden">
          <div className="flex items-center justify-between">
            <Link
              href="#"
              className="flex items-center gap-2 font-bold"
              prefetch={false}
            >
              <Image
                src={logoImage}
                alt="Index Ai Logo"
                className="si w-52 lg:w-fit"
              />
            </Link>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <AiOutlineMenu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation</span>
                </Button>
              </SheetTrigger>

              {/* mobile navlinks */}
              <SheetContent side="left" className="w-64">
                <div className="flex h-full flex-col justify-between py-6 px-4 mt-4">
                  <div className="space-y-6">
                    <nav className="space-y-1">
                      {navLinks?.map((link) => (
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

                  {/* sidebar footer */}
                  <div className="space-y-4">
                    <div className="flex flex-col justify-start items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Button
                        onClick={() => console.log("to profile page")}
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
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>
        <section className="p-2 pb-0 md:p-10 md:pb-0">
          {<AdminHeader />}
          {children}
        </section>
      </div>
    </div>
  );
}
