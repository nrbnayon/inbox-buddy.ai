// app\connect\components\TypeWritterEffect.jsx
"use client";

import { useEffect, useState } from "react";

export default function TypeWriterEffect({
  text,
  delay = 100,
  className = "",
}) {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Reset states when component remounts (due to key change)
  useEffect(() => {
    setCurrentText("");
    setCurrentIndex(0);
    setCursorVisible(true);
  }, []);

  // Handle the typing effect
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else {
      // Blink the cursor when typing is complete
      const blinkInterval = setInterval(() => {
        setCursorVisible((prev) => !prev);
      }, 500);

      return () => clearInterval(blinkInterval);
    }
  }, [currentIndex, delay, text]);

  return (
    <div className={`relative ${className}`}>
      <span className="whitespace-pre-wrap text-base">{currentText}</span>
      <span
        className={`absolute top-1 inline-block w-[2px] h-[1.2em] bg-white ml-[1px] ${
          cursorVisible ? "opacity-100" : "opacity-0"
        } transition-opacity duration-100`}
        style={{
          left: currentText.length > 0 ? "auto" : 0,
          bottom: 0,
        }}
      ></span>
    </div>
  );
}
