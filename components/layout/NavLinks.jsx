// components\layout\NavLinks.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks({ setIsOpen }) {
  const currentPath = usePathname();

  return (
    <div className="grid gap-2 py-6 pl-6 lg:flex mt-6 w-full">
      {[
        { title: "Pricing Plans", path: "/pricing" },
        { title: "About Us", path: "/about" },
        { title: "Privacy Policy", path: "/privacy" },
        // { title: "Security", path: "/security" },
        // { title: "Team", path: "/team" },
        { title: "Connect Today", path: "/connect" },
      ].map((text) => (
        <Link
          key={text.title}
          href={text.path}
          className={`flex w-full items-center justify-center py-3 rounded-full text-lg font-semibold lg:text-sm  bg-gradient-to-r hover:from-[#00ACDA] hover:to-[#43D4FB] ${
            currentPath === text.path && "from-[#00ACDA] to-[#43D4FB]"
          }`}
          prefetch={false}
          onClick={() => setIsOpen && setIsOpen(false)}
        >
          {text.title}
        </Link>
      ))}
    </div>
  );
}
