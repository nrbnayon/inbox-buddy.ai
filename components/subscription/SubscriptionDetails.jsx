// components/subscription/SubscriptionDetails.jsx
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  updateUserSubscription,
  cancelSubscription,
} from "@/lib/api/subscription";
import { getUserProfile } from "@/lib/api/user";
import { useRouter } from "next/navigation";
import {
  Calendar,
  CheckCircle2,
  Loader2,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function SubscriptionDetails({ onUpgrade }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserProfile();
        setUser(userData.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  if (!user) return null;

  const { subscription } = user;

  const startDate = subscription?.startDate
    ? new Date(subscription.startDate).toLocaleDateString()
    : "N/A";
  const endDate = subscription?.endDate
    ? new Date(subscription.endDate).toLocaleDateString()
    : "N/A";
  const isActive = subscription?.status === "active";
  const isCanceling = subscription?.status === "cancelled";

  console.log("subscription", subscription);

  const planDetails = {
    basic: {
      name: "Basic",
      color: "bg-blue-100 text-blue-800",
      maxInboxes: 1,
      dailyQueries: 15,
    },
    premium: {
      name: "Premium",
      color: "bg-purple-100 text-purple-800",
      maxInboxes: 3,
      dailyQueries: 100,
    },
    enterprise: {
      name: "Enterprise",
      color: "bg-indigo-100 text-indigo-800",
      maxInboxes: 10,
      dailyQueries: "Infinity",
    },
  };

  const currentPlan = planDetails[subscription?.plan || "basic"];

  const toggleAutoRenew = async () => {
    setIsUpdating(true);
    try {
      await updateUserSubscription({ autoRenew: !subscription.autoRenew });
      const updatedUser = await getUserProfile();
      setUser(updatedUser.data);

      toast(
        <>
          <strong className="font-semibold">Settings updated</strong>
          <div>
            Auto-renewal has been{" "}
            {subscription.autoRenew ? "disabled" : "enabled"}.
          </div>
        </>
      );
    } catch (error) {
      toast(
        <>
          <strong className="font-semibold text-red-600">
            Failed to update settings
          </strong>
          <div>{error.message}</div>
        </>,
        { style: { backgroundColor: "#fee2e2", color: "#b91c1c" } }
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      await cancelSubscription();
      const updatedUser = await getUserProfile();
      setUser(updatedUser.data);
      toast(
        <>
          <strong className="font-semibold text-red-600">
            Subscription Plan Cancelled
          </strong>
        </>
      );
    } catch (error) {
      toast(
        <>
          <strong className="font-semibold text-red-600">
            Failed to cancel subscription
          </strong>
          <div>{error.message}</div>
        </>,
        { style: { backgroundColor: "#fee2e2", color: "#b91c1c" } }
      );
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-xl md:text-2xl">Subscription</CardTitle>
            <CardDescription>Manage your subscription details</CardDescription>
          </div>
          <Badge
            className={`${currentPlan.color} px-3 py-1 text-sm font-medium`}
          >
            {currentPlan.name}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-gray-500">Status</div>
            <div className="flex items-center">
              {isActive && (
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              )}
              {isCanceling && (
                <RefreshCw className="h-5 w-5 text-amber-500 mr-2" />
              )}
              {!isActive && !isCanceling && (
                <XCircle className="h-5 w-5 text-red-500 mr-2" />
              )}
              <span className="font-medium">
                {isActive
                  ? "Active"
                  : isCanceling
                  ? "Canceling at period end"
                  : "Inactive"}
              </span>
            </div>
          </div>
          <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-gray-500">Daily Usage</div>
            <div className="font-medium">
              {subscription?.remainingQueries || 0} /{" "}
              {subscription.dailyQueries === "Infinity"
                ? "Infinity"
                : subscription.dailyQueries}{" "}
              queries used
            </div>
          </div>
          <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-gray-500">Start Date</div>
            <div className="flex items-center font-medium">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              {startDate}
            </div>
          </div>
          <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-gray-500">
              Renewal Date
            </div>
            <div className="flex items-center font-medium">
              <RefreshCw className="h-4 w-4 mr-2 text-gray-500" />
              {endDate}
            </div>
          </div>
          <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-gray-500">Max Inboxes</div>
            <div className="font-medium">{currentPlan.maxInboxes}</div>
          </div>
          <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-gray-500">
              Current Inboxes
            </div>
            <div className="font-medium">
              {user.inboxList?.length || 0} connected
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t mt-4">
          <div>
            <div className="font-medium">Auto-Renewal</div>
            <div className="text-sm text-gray-500">
              Automatically renew your subscription
            </div>
          </div>
          <div className="flex items-center">
            {isUpdating && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin text-gray-500" />
            )}
            <Switch
              checked={subscription?.autoRenew}
              onCheckedChange={toggleAutoRenew}
              disabled={isUpdating || !isActive}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 pt-2 border-t">
        <Button
          variant="outline"
          onClick={() => router.push("/pricing")}
          className="w-full sm:w-auto"
        >
          View Plans
        </Button>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {isActive && (
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={isCancelling}
              className="w-full sm:w-auto"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Subscription
                </>
              )}
            </Button>
          )}
          <Button
            variant="blueGradient"
            onClick={onUpgrade}
            className="w-full sm:w-auto text-white"
          >
            Upgrade Subscription
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
