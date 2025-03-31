// app\login\page.js

import LoginForm from "./components/LoginForm";
import LoginTypeWritter from "./components/LoginTypeWritter";

export default function loginPage() {
  return (
    <div className="flex h-[89.5vh] relative overflow-hidden">
      {/* Left side with gradient and glass effect - hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center z-0">
        {/* Gradient background with glass effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00ACDA] via-blue-400 to-[#43D4FB] backdrop-blur-lg opacity-90"></div>

        {/* Dark glass overlay */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

        {/* Subtle light effect */}
        {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] rounded-full radial-gradient opacity-10"></div> */}

        {/* Content */}
        <div className="relative z-10 text-center text-white text-3xl font-bold p-8">
          <LoginTypeWritter />
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 ">
        <LoginForm />
      </div>
    </div>
  );
}
