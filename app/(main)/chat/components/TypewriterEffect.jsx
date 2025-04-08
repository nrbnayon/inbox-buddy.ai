"use client";
import { useState, useEffect } from "react";
export default function TypewriterEffect() {
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [dots, setDots] = useState("");
  const [index, setIndex] = useState(0);
  const thinkingPhrases = [
    "Thinking",
    "Analyzing email",
    "Processing attachments",
    "Reviewing content",
    "Extracting key points",
    "Generating summary",
    "Finding context",
    "Checking details",
    "Organizing information",
    "Identifying action items",
    "Preparing response",
  ];
  // Rotate through different thinking phrases
  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % thinkingPhrases.length);
      setCurrentPhrase(thinkingPhrases[index]);
    }, 2000);
    return () => clearInterval(phraseInterval);
  }, [index]);
  // Animate the dots
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(dotsInterval);
  }, []);
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 text-blue-600 font-medium">
        <span>
          {currentPhrase || thinkingPhrases[0]} {dots}
        </span>
        {/* <span className="animate-pulse">▋</span> */}
      </div>
      <div className="mt-2">
        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
          <div
            className="bg-blue-500 h-1.5 rounded-full animate-pulse"
            style={{ width: `${(index / thinkingPhrases.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
