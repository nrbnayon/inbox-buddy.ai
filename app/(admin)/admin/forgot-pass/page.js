"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import SmallLoader from "@/components/SmallLoader";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const email = e.target.email.value;

    try {
      // Make API call to send verification email
      // Replace with your actual API call
      const response = await axiosInstance.post("/users/forgot-password", {
        email,
      });

      const data = response.data;

      if (data.success) {
        toast.success("Verification email sent successfully!");
        router.push(`/admin/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        throw new Error(data.message || "Failed to send verification email");
      }
    } catch (err) {
      console.error("Forgot password request failed:", err);
      toast.error(err.message || "Failed to send verification email!");
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while processing your request"
      );
    } finally {
      setLoading(false);
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
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a verification code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              <div className="flex flex-col gap-3">
                <Button
                  variant="blueGradient"
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <p className="flex items-center">
                      <SmallLoader /> Sending...
                    </p>
                  ) : (
                    "Send Verification Code"
                  )}
                </Button>
              </div>
              <div className="text-center text-sm">
                Remember your password?{" "}
                <Link
                  href="/admin/auth"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Back to login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
