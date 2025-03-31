// components\layout\Navbar.jsx
"use client";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import logoImage from "@/public/Frame 2.svg";
import NavLinks from "./NavLinks";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";

const publicRoutes = [
  "/",
  "/pricing",
  "/about",
  "/connect",
  "/login",
  // "/security",
  // "/team",
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const pathName = usePathname();

  if (!publicRoutes.includes(pathName)) {
    return;
  }
  return (
    <header className="">
      <div className="container flex h-24 w-full py-6 items-center px-4 md:px-6 justify-between mx-auto">
        {/* Logo should always be visible */}
        <Link href="/" className="flex items-center w-full" prefetch={false}>
          {/* <MountainIcon className="h-6 w-6" /> */}
          <Image
            src={logoImage}
            alt="Index Ai Logo"
            className="w-40 lg:w-fit"
          />
          {/* <span className="sr-only">Acme Inc</span> */}
        </Link>

        {/* Navigation for large screens */}
        <nav className="hidden lg:flex gap-6 w-full">
          <NavLinks />
        </nav>

        {/* Mobile Menu (Hamburger on the right) */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden ml-auto bg-[#e9e9e9] border border-white"
            >
              <AiOutlineMenu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <NavLinks setIsOpen={setIsOpen} />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
