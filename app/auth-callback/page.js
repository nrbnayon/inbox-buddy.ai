// app\auth-callback\page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingPing from "@/components/LoadingPing";
import { setCookiesAction } from "../actions/authActions";
import { toast } from "sonner";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuth = async () => {
      const accessToken = searchParams.get("accessToken");
      const refreshToken = searchParams.get("refreshToken");
      const redirect = searchParams.get("redirect") || "/dashboard";
      const errorMsg = searchParams.get("error");

      if (errorMsg) {
        const decodedError = decodeURIComponent(errorMsg);
        toast.error(decodedError);
        setError(decodedError);
        setTimeout(() => router.push("/login"), 4000);
        return;
      }

      if (!accessToken || !refreshToken) {
        setError("Authentication failed: Missing tokens");
        toast.error("Authentication failed: Missing tokens");
        setTimeout(() => router.push("/login"), 3000);
        return;
      }

      try {
        const result = await setCookiesAction({ accessToken, refreshToken });
        if (result.success) {
          router.push("/dashboard");
        } else {
          setError("Failed to set authentication cookies");
          toast.error("Failed to set authentication cookies");
          setTimeout(() => router.push("/login"), 3000);
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        setError("Authentication error");
        toast.error("Authentication error");
        setTimeout(() => router.push("/login"), 3000);
      }
    };

    handleAuth();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 bg-red-100 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <h3 className="mt-4 text-xl font-medium text-gray-900 text-center">
            Authentication Failed or Access Denied
          </h3>

          <p className="mt-2 text-sm text-gray-500 text-center">{error}</p>

          <p className="mt-4 text-sm text-gray-500 text-center">
            Redirecting to login page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingPing />
        <h3 className="mt-4 text-xl font-medium text-gray-900">
          Authenticating...
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Please wait while we log you in
        </p>
      </div>
    </div>
  );
}
