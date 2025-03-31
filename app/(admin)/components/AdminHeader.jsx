"use client";

import { useState, useEffect } from "react";

export default function ChatHeader() {
  const [currentTime, setCurrentTime] = useState("");

  // Function to format the date and time
  const updateTime = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      // second: "2-digit",
    });
    const dateString = now.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    // Add ordinal suffix (e.g., "12th" instead of "12")
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
    setCurrentTime(`It's ${timeString} | ${formattedDate}`);
  };

  // Update time every second
  useEffect(() => {
    updateTime(); // Set initial time
    const interval = setInterval(updateTime, 1000); // Update every second
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="bg-[#F1F1F1] flex justify-between items-center p-3 lg:p-6 rounded-lg mb-3 lg:mb-6 sticky top-0">
      <h1 className="text-xl font-semibold">Welcome Josh</h1>
      <div className="text-lg text-gray-900">{currentTime}</div>
    </div>
  );
}
