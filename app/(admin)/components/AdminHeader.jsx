"use client";
import { useState, useEffect } from "react";
import { logout } from "@/lib/api/user";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";

export default function AdminHeader({ user }) {
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  // Function to format the date and time
  const updateTime = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const day = now.getDate();
    const ordinalSuffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";
    const formattedDate = `${day}${ordinalSuffix} ${now.toLocaleString(
      "en-US",
      {
        month: "long",
      }
    )}, ${now.getFullYear()}`;
    setCurrentTime(`${timeString} | ${formattedDate}`);
  };

  // Initialize and update time
  useEffect(() => {
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="link-btn text-white shadow p-4 lg:p-6 rounded-xl mb-6 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left: Welcome Message */}
        <div className="flex items-center space-x-3">
          {user ? (
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight">
              Welcome, {user.firstName || user.name || "User"}
            </h1>
          ) : (
            <Loader2 className="animate-spin h-6 w-6" />
          )}
        </div>

        {/* Right: Time and Logout */}
        <div className="flex items-center space-x-4">
          <div className="text-sm lg:text-base font-medium">
            It's {currentTime || "Loading time..."}
          </div>
        </div>
      </div>
    </header>
  );
}
