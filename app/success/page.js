// app\success\page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserProfile } from "@/lib/api/user";
import { toast } from "sonner";
import Link from "next/link";
import { axiosInstance } from "@/lib/axios";
import { getTokensFromCookies } from "@/app/actions/authActions";

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const verifySubscription = async () => {
      // Redirect if no session ID is provided
      if (!sessionId) {
        setLoading(false);
        setError("Invalid session. Redirecting to login...");
        await delay(1500);
        router.push("/login");
        return;
      }

      try {
        // Get initial user profile
        const userProfile = await getUserProfile();
        setUserData(userProfile.data);

        // Verify user authentication
        if (!userProfile.data._id || userProfile.data.role !== "user") {
          setLoading(false);
          setError("Authentication required. Redirecting to login...");
          await delay(1500);
          router.push("/login");
          return;
        }

        // Ensure we have an access token
        const { accessToken } = await getTokensFromCookies();
        if (!accessToken) {
          throw new Error("No access token found. Please log in again.");
        }

        // Verify the Stripe session
        const response = await axiosInstance.post("/stripe/verify-session", {
          sessionId,
        });

        if (response.data.success) {
          // Get updated user profile after verification
          const updatedUser = await getUserProfile();
          setUserData(updatedUser.data);

          // Check if subscription is active
          if (
            updatedUser.data.subscription?.status === "active" &&
            updatedUser.data.subscription?.stripeSubscriptionId
          ) {
            toast.success("Subscription Updated", {
              description: "Your account has been upgraded with the new plan.",
            });
          } else {
            // If webhook hasn't processed yet, wait a bit and check again
            await delay(3000);
            const finalUser = await getUserProfile();
            setUserData(finalUser.data);

            if (
              finalUser.data.subscription?.status === "active" &&
              finalUser.data.subscription?.stripeSubscriptionId
            ) {
              toast.success("Subscription Updated", {
                description:
                  "Your account has been upgraded with the new plan.",
              });
            } else {
              toast.warning("Subscription Processing", {
                description:
                  "Payment succeeded, but subscription is still processing. Check back soon.",
              });
            }
          }
        } else {
          throw new Error(response.data.message || "Verification failed");
        }
      } catch (err) {
        console.error("Error verifying subscription:", err);

        // Set user-friendly error message
        setError(
          "Failed to verify subscription. Please try again or contact support."
        );

        toast.error("Error", {
          description: err.message || "Verification failed. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    verifySubscription();
  }, [sessionId, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md text-center">
          <CheckCircle className="w-16 h-16 mx-auto text-gray-400 animate-pulse mb-4" />
          <h1 className="text-2xl font-bold text-gray-600 mb-4">
            Processing...
          </h1>
          <p className="text-gray-500 mb-6">
            Verifying your subscription, please wait.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md text-center">
        {error ? (
          <>
            <CheckCircle className="w-16 h-16 mx-auto text-amber-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Payment Verification Issue
            </h1>
          </>
        ) : (
          <>
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Payment Successful!
            </h1>
          </>
        )}
        <p className="text-gray-600 mb-6">
          {error
            ? error
            : "Thank you for your subscription. Your account has been upgraded and your new features are now available."}
        </p>
        <div className="flex flex-col gap-3">
          <Button variant="blueGradient" asChild className="w-full">
            <Link href="/chat">Chat Now</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}