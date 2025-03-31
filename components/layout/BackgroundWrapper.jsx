"use client";

import { usePathname } from "next/navigation";
import bgImage from "@/public/herobg.svg";

export default function BackgroundWrapper({ children }) {
  const isHomePage = usePathname() === "/";

  return (
    <main
      className={`min-h-screen ${
        isHomePage
          ? "bg-white bg-no-repeat bg-cover"
          : // : "bg-[#E0E8EA] bg-gradient-to-r from-[#E5E8E9] from-10% via-[#E0E8EA] via-30% to-[#E3E8E9] to-90%"
            "bg-white"
      }`}
      style={isHomePage ? { backgroundImage: `url(${bgImage.src})` } : {}}
    >
      {/* // <main
    //   className={`min-h-screen bg-[#e9e9e9] bg-cover "`}
    //   style={{ backgroundImage: `url(${bgImage.src})` }}
    // > */}
      {children}
    </main>
  );
}
