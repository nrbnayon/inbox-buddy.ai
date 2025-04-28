"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { InputOTPForm } from "./components/input-otp-form";
import { axiosInstance } from "@/lib/axios";
import SmallLoader from "@/components/SmallLoader";

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (!emailParam) {
      router.push("/admin/forgot-pass");
    } else {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit verification code");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/users/verify-otp", {
        email,
        otp,
      });

      const data = response.data;

      if (data.success) {
        toast.success("Email verified successfully!");
        router.push(`/admin/reset-pass?email=${email}&token=${otp}`);
      } else {
        throw new Error(data.message || "Invalid verification code");
      }
    } catch (err) {
      console.error("OTP verification failed:", err);
      toast.error(err.message || "Verification failed!");
      setError(err.message || "An error occurred during verification");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      toast.error("Email address is missing");
      return;
    }

    try {
      setResendLoading(true);
      const response = await axiosInstance.post("/users/forgot-password", {
        email,
      });

      const data = response.data;

      if (data.success) {
        toast.success("Verification code resent successfully!");
      } else {
        throw new Error(data.message || "Failed to resend verification code");
      }
    } catch (err) {
      console.error("Resend OTP failed:", err);
      toast.error(err.message || "Failed to resend verification code!");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex h-screen flex-col justify-center items-center gap-6 mt-9 px-4"
      )}
    >
      <Card className="w-fit sm:w-md">
        <CardHeader>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            Enter the verification code sent to {email || "your email"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <InputOTPForm onComplete={setOtp} />
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <div className="flex flex-col gap-3">
              <Button
                variant="blueGradient"
                type="submit"
                className="w-full"
                disabled={loading || otp.length !== 6}
              >
                {loading ? (
                  <p className="flex items-center">
                    <SmallLoader /> Verifying...
                  </p>
                ) : (
                  "Verify Code"
                )}
              </Button>
            </div>
            <div className="text-center text-sm">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResendOTP}
                className="underline underline-offset-4 hover:text-primary"
                disabled={resendLoading}
              >
                {resendLoading ? <SmallLoader /> : "Resend code"}
              </button>
            </div>
            <div className="text-center text-sm">
              <Link
                href="/admin/forgot-pass"
                className="underline underline-offset-4 hover:text-primary"
              >
                Try with a different email
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
