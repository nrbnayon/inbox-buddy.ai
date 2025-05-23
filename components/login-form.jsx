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
import { loginAction } from "@/app/actions/authActions";
import { toast } from "sonner";

export function LoginForm({ className, ...props }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const userData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      // Make API call with form data
      const res = await loginAction(userData);

      if (res.success) {
        router.push("/admin");
      } else {
        // Handle login failure - We now have a proper error message from the server
        const errorMessage = res.message || "Invalid credentials";
        toast.error(errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      // This will only run if the server action itself fails (not the login)
      console.error("Server action failed:", err);
      toast.error("Invalid credentials");
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex h-screen flex-col justify-center items-center gap-6 mt-9 px-4",
        className
      )}
      {...props}
    >
      <Card className="w-fit sm:w-md">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
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
                  placeholder="admin@example.com"
                  required
                  disabled={loading}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/admin/forgot-pass"
                    className="ml-auto inline-block text-[12px] sm:text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  placeholder="********"
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
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
