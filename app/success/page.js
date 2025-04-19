// app/success/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserProfile } from "@/lib/api/user";
import { toast } from "sonner";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      const fetchData = async () => {
        try {
          // Delay to allow webhook processing
          await new Promise((resolve) => setTimeout(resolve, 2000));
          const userData = await getUserProfile();
          if (
            userData.data.subscription.status !== "active" ||
            !userData.data.subscription.stripeSubscriptionId
          ) {
            toast.warning("Subscription Processing", {
              description:
                "Your payment was successful, but the subscription is still being processed. Please check back in a few moments.",
            });
          }
          setLoading(false);
        } catch (error) {
          console.error("Error refreshing user data:", error);
          toast.error("Error", {
            description: "Failed to verify subscription. Please try again.",
          });
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md text-center">
        <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          {loading
            ? "Verifying your subscription..."
            : "Thank you for your subscription. Your account has been upgraded and your new features are now available."}
        </p>
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => router.push("/dashboard")}
            className="w-full"
            disabled={loading}
          >
            Go to Dashboard
          </Button>
          <Button
            onClick={() => router.push("/subscription-details")}
            variant="outline"
            className="w-full"
            disabled={loading}
          >
            View Subscription Details
          </Button>
        </div>
      </div>
    </div>
  );
}