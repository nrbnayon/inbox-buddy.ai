import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserProfile } from "@/lib/api/user";
import { toast } from "sonner";
import Link from "next/link";
import { redirect } from "next/navigation";

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function SuccessPage({ searchParams }) {
  const { sessionId } = await searchParams;
  const res = await getUserProfile();
  let loading = true;
  let error = null;
  const userData = res.data;

  if (!sessionId) {
    return redirect("/login");
  }

  if (!userData._id || userData.role !== "user") {
    return redirect("/login");
  }

  if (sessionId) {
    try {
      // Delay to allow webhook processing
      await delay(2000);

      if (
        userData.data.subscription.status !== "active" ||
        !userData.data.subscription.stripeSubscriptionId
      ) {
        toast.warning("Subscription Processing", {
          description:
            "Your payment was successful, but the subscription is still being processed. Please check back in a few moments.",
        });
      }
      loading = false;
    } catch (err) {
      console.error("Error refreshing user data:", err);
      toast.error("Error", {
        description: "Failed to verify subscription. Please try again.",
      });
      error = "Failed to verify subscription. Please try again.";
      loading = false;
    }
  } else {
    loading = false;
  }

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
            : error
            ? error
            : "Thank you for your subscription. Your account has been upgraded and your new features are now available."}
        </p>
        <div className="flex flex-col gap-3">
          <Button
            variant="blueGradient"
            asChild
            className="w-full"
            disabled={loading}
          >
            <Link href="/chat">Chat Now</Link>
          </Button>
          <Button
            variant="outline"
            asChild
            className="w-full"
            disabled={loading}
          >
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
