// app\connect\page.js
import SignUpForm from "./components/SignupForm";
import TypeWritter from "./components/TypeWritter";

export const metadata = {
  title: "Join Inbox-Buddy Today for Access to AI Email Management",
  description:
    "Join Inbox-Buddy today for access to our AI-powered email assistant. Sign up now to streamline your email communication with secure, efficient tools.",
  keywords:
    "Inbox-Buddy signup, join Inbox-Buddy, AI email assistant, email management, connect today, AI-powered email tool",
  robots:
    process.env.NODE_ENV === "production"
      ? "index, follow"
      : "noindex, nofollow",
  openGraph: {
    title: "Join Inbox-Buddy Today for Access to Smart Email Solutions",
    description:
      "Sign up for Inbox-Buddy and gain access to secure, AI-driven email management. Join today to simplify your workflow with our easy-to-use platform.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/connect`,
    type: "website",
    images: [
      {
        url: "https://i.postimg.cc/4xy8d9ZS/Frame-2.webp",
        width: 1000,
        height: 600,
        alt: "Inbox-Buddy Join Today Page",
      },
      {
        url: `${process.env.NEXT_PUBLIC_ASSET_API_BASE_URL}/uploads/images/logo.png`,
        width: 1000,
        height: 600,
        alt: "Inbox-Buddy Logo",
      },
    ],
  },
};

export default function conntectPage() {
  return (
    <div className="flex h-[89.5vh] relative overflow-hidden">
      {/* Left side with gradient and glass effect - hidden on mobile */}
      <div className="hidden 2xl:flex 2xl:w-1/2 relative items-center justify-center">
        {/* Gradient background with glass effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00ACDA] via-blue-400 to-[#43D4FB] backdrop-blur-lg opacity-90"></div>

        {/* Dark glass overlay */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

        {/* Subtle light effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] rounded-full radial-gradient opacity-10"></div>

        {/* Content */}
        <div className="relative z-10 text-center text-white text-3xl font-bold p-8">
          <TypeWritter />
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-full 2xl:w-1/2 flex items-center justify-center p-6 ">
        <SignUpForm />
      </div>
    </div>
  );
}
