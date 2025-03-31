// app\connect\components\SignupForm.jsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { InboxIcon, Mail, MessageCircleQuestion, User } from "lucide-react";
import Link from "next/link";
import InputField from "./InputField";

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inboxCount: "",
    painPoint: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your form submission logic here
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-start mb-6">
        <h1 className="text-2xl font-bold mb-2">Join the Waiting List!</h1>
        <p className="text-gray-600">
          Sign up early to receive one month - cost free!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* name */}
        <InputField
          icon={User}
          name={"name"}
          type={"text"}
          placeHolder={"Name"}
          value={formData.name}
          handleChange={handleChange}
        />

        {/* mail */}
        <InputField
          icon={Mail}
          name={"email"}
          type={"email"}
          placeHolder={"E-mail"}
          value={formData.email}
          handleChange={handleChange}
        />

        {/* inbox count */}
        <InputField
          icon={InboxIcon}
          name={"inboxCount"}
          type={"text"}
          placeHolder={"How many inboxes / apps would you like to connect?"}
          value={formData.inboxCount}
          handleChange={handleChange}
        />

        {/* feedback */}
        <div className="relative">
          <MessageCircleQuestion className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Textarea
            name="painPoint"
            placeholder="If we could fix one of your pain points, what would it be?"
            value={formData.painPoint}
            onChange={handleChange}
            className="pl-10 min-h-[100px] resize-none bg-[#F2F4F7] focus-visible:ring-0"
          />
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            className="py-6 mt-6 px-24 w-[80%] rounded-full bg-gradient-to-r from-[#00ACDA] via-blue-400 to-[#43D4FB] hover:opacity-90 text-white"
          >
            Join
          </Button>
        </div>
      </form>

      <div className="text-center mt-4 text-sm">
        Already have an account?
        <Link
          href="/login"
          className="text-[#00ACDA] hover:text-[#43D4FB] ml-1"
        >
          Login to your account
        </Link>
      </div>
    </div>
  );
}
