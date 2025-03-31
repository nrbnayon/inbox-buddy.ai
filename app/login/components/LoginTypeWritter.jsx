// app\login\components\LoginTypeWritter.jsx
"use client";

import { useEffect, useState } from "react";
import TypeWriterEffect from "@/app/connect/components/TypeWritterEffect";
import { RiSparkling2Line } from "react-icons/ri";

// Array of question-response pairs (only using questions)
const conversationPairs = [
  {
    question: "What meetings do I have this week?",
    answer:
      "I’ll scan your emails and list all upcoming meetings scheduled for this week!",
  },
  {
    question: "Are there any interviews on my calendar?",
    answer:
      "Let me check your emails—I'll find any interview invites for this week.",
  },
  {
    question: "Can you summarize my latest emails?",
    answer: "Sure, I’ll give you a quick rundown of your most recent emails.",
  },
  {
    question: "Any urgent emails I should know about?",
    answer:
      "I’ll look for emails marked as urgent or important and let you know!",
  },
  {
    question: "What’s my next deadline?",
    answer:
      "I’ll dig through your emails to find any upcoming deadlines and tell you the closest one.",
  },
  {
    question: "Who emailed me about the project update?",
    answer:
      "I’ll search your inbox and tell you who sent project-related updates.",
  },
  {
    question: "Do I have any unread emails from my boss?",
    answer:
      "I’ll check for unread emails from your boss and list them for you.",
  },
  {
    question: "When’s my next team sync?",
    answer: "I’ll find your next team sync meeting from your email invites!",
  },
  {
    question: "Any emails about training sessions?",
    answer: "I’ll look for training-related emails and give you the details.",
  },
  {
    question: "What subscriptions am I signed up for?",
    answer:
      "I’ll scan your emails for subscription confirmations and list them out.",
  },
];

export default function LoginTypeWritter() {
  const [cycle, setCycle] = useState(0);
  const [pairIndex, setPairIndex] = useState(0);

  // Get current question based on the pair index
  const currentPair = conversationPairs[pairIndex];
  const { question } = currentPair;

  useEffect(() => {
    let questionTimer;

    // Move to the next question after the current one finishes typing
    questionTimer = setTimeout(() => {
      setPairIndex((prev) => (prev + 1) % conversationPairs.length); // Move to next question
      setCycle((prev) => prev + 1); // Increment cycle to trigger new animation
    }, question.length * 80 + 1000); // Wait for question typing + pause

    return () => {
      clearTimeout(questionTimer);
    };
  }, [cycle, question]); // Re-run effect when cycle or question changes

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <h1>Your Mail AI Assistant</h1>
        {/* Question input */}
        <div className="relative">
          <div className="flex w-full items-center space-x-2">
            <div className="relative flex-1">
              <div className="min-h-10 w-[600px] text-center rounded-md px-3 py-2 text-sm ring-offset-background">
                <TypeWriterEffect
                  text={question}
                  delay={80}
                  key={`input-${cycle}`}
                  className="text-white"
                />
              </div>
            </div>
            {/* Uncomment if you want the button back */}
            {/* <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-transparent text-primary-foreground border h-10 px-4 py-2">
              <RiSparkling2Line size={20} />
            </button> */}
          </div>
        </div>
      </div>
    </main>
  );
}
