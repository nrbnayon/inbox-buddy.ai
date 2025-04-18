// app\pricing\components\PricingPlans.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { createCheckoutSession } from "@/lib/api/subscription";
import { getUserProfile } from "@/lib/api/user";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function PricingPlans() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [processingPlan, setProcessingPlan] = useState(null);
  const [user, setUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsUserLoading(true);
      try {
        const userData = await getUserProfile();
        setUser(userData.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        toast.error("Failed to load user data", {
          description: "Please try refreshing the page.",
        });
      } finally {
        setIsUserLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "$5",
      description: "/mo",
      features: [
        "Connect One inbox",
        "15 queries per day",
        "Basic Summary Function",
        "Standard Support",
        "Limited Third Party Integration",
      ],
      highlighted: false,
    },
    {
      id: "premium",
      name: "Premium",
      price: "$15",
      description: "/mo",
      features: [
        "Connect three inboxes",
        "100 queries per day",
        "Unlimited AI Agent",
        "Advanced Summaries",
        "Advanced Third Party Integration",
      ],
      highlighted: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$50",
      description: "/mo",
      features: [
        "Connect 10 inboxes",
        "Unlimited queries",
        "Unlimited AI Agents",
        "Advanced Summaries",
        "Unlimited Third Party Integration",
      ],
      highlighted: false,
    },
  ];

  const handleSubscribe = async (planId) => {
    console.log("Subscribing to plan:", planId);
    if (isUserLoading) {
      toast.info("Please wait", {
        description: "Verifying your account status...",
      });
      return;
    }

    if (!user) {
      toast.error("Authentication required", {
        description: "Please login to subscribe to a plan",
        action: {
          label: "Login",
          onClick: () => router.push("/login"),
        },
      });
      return;
    }

    setIsLoading(true);
    setProcessingPlan(planId);

    try {
      const { sessionId } = await createCheckoutSession(planId);
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      toast.error("Subscription Error", {
        description: error.message || "Failed to process subscription",
      });
    } finally {
      setIsLoading(false);
      setProcessingPlan(null);
    }
  };

  const isCurrentPlan = (planId) =>
    user?.subscription?.plan === planId &&
    user?.subscription?.status === "active" &&
    new Date(user?.subscription?.endDate) > new Date();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`flex flex-col h-full shadow-none border border-[#D9D9D9] rounded-md ${
                plan.highlighted
                  ? "bg-gradient-to-br from-[#00ACDA] to-[#43D4FB] text-white"
                  : ""
              }`}
            >
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-4">
                <div className="flex justify-center items-baseline mb-6">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-sm ml-1">{plan.description}</span>
                </div>
                <ul className="space-y-3 text-left">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto pt-4">
                <Button
                  className={`w-full ${
                    plan.highlighted
                      ? "bg-white text-[#00ACDA] hover:bg-gray-100"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={
                    isLoading || isUserLoading || isCurrentPlan(plan.id)
                  }
                >
                  {isLoading && processingPlan === plan.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : isUserLoading ? (
                    "Loading..."
                  ) : isCurrentPlan(plan.id) ? (
                    "Current Plan"
                  ) : (
                    "Select Plan"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}