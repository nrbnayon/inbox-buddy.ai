// app\login\components\LoginForm.jsx
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Mail } from "lucide-react";
import PermissionModal from "@/components/modals/PermissionModal";
import { toast } from "sonner";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { checkWaitingListStatus, handleOAuthLogin } from "@/lib/api/user";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      toast.error(decodeURIComponent(error));
    }
  }, [error]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const checkEmailApproval = async (email) => {
    if (!email || !validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    setIsLoading(true);
    try {
      const status = await checkWaitingListStatus(email);
      console.log(
        "Get status: ",
        status,
        "status.status: ",
        status.status,
        "status.approved: ",
        status.approved
      );
      if (status.status === "approved") {
        return true;
      } else {
        toast.error(
          "Your account is not yet approved. Please wait for admin approval."
        );
        return false;
      }
    } catch (error) {
      toast.error(error.message || "Failed to check waiting list status");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleProviderClick = async (provider) => {
    setSelectedProvider(provider);
    setShowPermissionModal(true);
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const isApproved = await checkEmailApproval(email);
      if (isApproved) {
        setSelectedProvider("google");
        setShowPermissionModal(true);
      }
    } catch (error) {
      toast.error(error.message || "Failed to check waiting list status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueWithPermissions = async () => {
    setShowPermissionModal(false);

    if (!email || !validateEmail(email)) {
      if (selectedProvider !== "google" && selectedProvider !== "microsoft") {
        toast.error("Please enter a valid email address");
        return;
      }

      // If it's a direct provider login without email, proceed
      handleOAuthLogin(selectedProvider);
      return;
    }

    const isApproved = await checkEmailApproval(email);
    if (isApproved) {
      handleOAuthLogin(selectedProvider, email);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center lg:text-start mb-6">
        <h1 className="text-2xl font-bold mb-2">Login</h1>
        <p className="text-gray-600">Choose your mailbox to get started</p>
      </div>

      <div className="flex justify-center lg:justify-start gap-8 md:gap-10 ">
        <button
          onClick={() => handleProviderClick("google")}
          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <Image src="/gmail.png" alt="Gmail" width={50} height={50} />
        </button>
        <button
          onClick={() => handleProviderClick("microsoft")}
          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <Image src="/outlook.png" alt="Outlook" width={50} height={50} />
        </button>
      </div>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-4 mb-8">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="email"
            placeholder="Enter your email"
            className="pl-10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          className="w-full py-6 rounded-full bg-gradient-to-r from-[#00ACDA] to-[#43D4FB] hover:opacity-90"
          disabled={isLoading}
        >
          {isLoading ? "Checking..." : "Continue with Email"}
        </Button>
      </form>

      <div className="text-center mt-8 text-sm text-gray-600">
        Not a member?{" "}
        <Link href="/connect" className="text-[#00ACDA] hover:text-[#43D4FB]">
          Request for access
        </Link>
      </div>

      <PermissionModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        provider={selectedProvider}
        onContinue={handleContinueWithPermissions}
      />
    </div>
  );
}
