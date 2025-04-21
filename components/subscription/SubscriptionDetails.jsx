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
  cancelSubscription,
  cancelAutoRenew,
  enableAutoRenew,
} from "@/lib/api/subscription";
import { getUserProfile } from "@/lib/api/user";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Loader2,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SubscriptionDetails({ onUpgrade }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isTogglingAutoRenew, setIsTogglingAutoRenew] = useState(false);

  // Confirmation modal states
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [autoRenewDialogOpen, setAutoRenewDialogOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const userData = await getUserProfile();
        setUser(userData.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        toast(
          <>
            <strong className="font-semibold text-red-600">Error</strong>
            <div>Failed to load subscription details</div>
          </>,
          { style: { backgroundColor: "#fee2e2", color: "#b91c1c" } }
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <Card className="w-full shadow-md flex items-center justify-center p-10">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-gray-500">Loading subscription details...</p>
        </div>
      </Card>
    );
  }

  if (!user) return null;

  const { subscription } = user;

  const startDate = subscription?.startDate
    ? new Date(subscription.startDate).toLocaleDateString()
    : "N/A";
  const endDate = subscription?.endDate
    ? new Date(subscription.endDate).toLocaleDateString()
    : "N/A";
  const isActive = subscription?.status === "active";
  const isCanceled = subscription?.status === "cancelled";
  const isAutoRenewOn = subscription?.autoRenew;

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

  const handleToggleAutoRenew = () => {
    setConfirmationAction(
      isAutoRenewOn ? "disable-auto-renew" : "enable-auto-renew"
    );
    setAutoRenewDialogOpen(true);
  };

  const executeToggleAutoRenew = async () => {
    setIsTogglingAutoRenew(true);
    try {
      // Call the appropriate API based on current state
      if (isAutoRenewOn) {
        await cancelAutoRenew();
      } else {
        await enableAutoRenew();
      }

      // Update user data
      const updatedUser = await getUserProfile();
      setUser(updatedUser.data);

      toast(
        <>
          <strong className="font-semibold">Settings updated</strong>
          <div>
            {isAutoRenewOn
              ? `Auto-renewal has been disabled. Your subscription will remain active until ${endDate}.`
              : `Auto-renewal has been enabled. Your subscription will automatically renew on ${endDate}.`}
          </div>
        </>
      );
    } catch (error) {
      toast(
        <>
          <strong className="font-semibold text-red-600">
            Failed to update auto-renewal setting
          </strong>
          <div>{error.message}</div>
        </>,
        { style: { backgroundColor: "#fee2e2", color: "#b91c1c" } }
      );
    } finally {
      setIsTogglingAutoRenew(false);
      setAutoRenewDialogOpen(false);
    }
  };

  const handleCancelSubscriptionClick = () => {
    setCancelDialogOpen(true);
  };

  const executeCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      await cancelSubscription();
      const updatedUser = await getUserProfile();
      setUser(updatedUser.data);
      toast(
        <>
          <strong className="font-semibold">Subscription Cancelled</strong>
          <div>Your subscription will end on {endDate} and will not renew.</div>
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
      setCancelDialogOpen(false);
    }
  };

  const renderSubscriptionStatus = () => {
    if (isActive && !isAutoRenewOn) {
      return (
        <>
          <RefreshCw className="h-5 w-5 text-amber-500 mr-2" />
          <span className="font-medium">Active (Expires on {endDate})</span>
        </>
      );
    } else if (isActive) {
      return (
        <>
          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
          <span className="font-medium">Active</span>
        </>
      );
    } else if (isCanceled) {
      return (
        <>
          <XCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="font-medium">Cancelled</span>
        </>
      );
    } else {
      return (
        <>
          <XCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="font-medium">Inactive</span>
        </>
      );
    }
  };

  return (
    <>
      <Card className="w-full shadow-md mt-8">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-xl md:text-2xl">
                Subscription
              </CardTitle>
              <CardDescription>
                Manage your subscription details
              </CardDescription>
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
                {renderSubscriptionStatus()}
              </div>
            </div>
            <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-gray-500">
                Daily Usage
              </div>
              <div className="font-medium">
                {console.log(subscription)}
                {subscription?.remainingQueries || 0} /{" "}
                {currentPlan.dailyQueries === "Infinity"
                  ? "∞"
                  : currentPlan.dailyQueries}{" "}
                {/* queries remaining */}
              </div>
            </div>
            <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-gray-500">
                Start Date
              </div>
              <div className="flex items-center font-medium">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                {startDate}
              </div>
            </div>
            <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-gray-500">
                {isAutoRenewOn ? "Renewal Date" : "Expiry Date"}
              </div>
              <div className="flex items-center font-medium">
                <RefreshCw className="h-4 w-4 mr-2 text-gray-500" />
                {endDate}
              </div>
            </div>
            {/* <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-gray-500">
                Max Inboxes
              </div>
              <div className="font-medium">{currentPlan.maxInboxes}</div>
            </div>
            <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-gray-500">
                Current Inboxes
              </div>
              <div className="font-medium">
                {user.inboxList?.length || 0} connected
              </div>
            </div> */}
          </div>
          <div className="flex items-center justify-between pt-4 border-t mt-4">
            <div>
              <div className="font-medium">Auto-Renewal</div>
              <div className="text-sm text-gray-500">
                {isAutoRenewOn
                  ? "Your subscription will automatically renew when it expires"
                  : "Your subscription will expire on the end date"}
              </div>
            </div>
            <div className="flex items-center">
              {isTogglingAutoRenew && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin text-gray-500" />
              )}
              <Switch
                checked={isAutoRenewOn}
                onCheckedChange={handleToggleAutoRenew}
                disabled={isTogglingAutoRenew || !isActive || isCanceled}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 pt-2 border-t">
          <Button
            variant="outline"
            onClick={onUpgrade}
            className="w-full sm:w-auto"
          >
            View Plans
          </Button>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {isActive && (
              <Button
                variant="destructive"
                onClick={handleCancelSubscriptionClick}
                disabled={isCancelling || isCanceled}
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

      {/* Cancel Subscription Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              Cancel Subscription
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your {currentPlan.name}{" "}
              subscription?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-3">
              <p>Your subscription will be active until {endDate}.</p>
              <p>After cancellation:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>You'll no longer be charged</li>
                <li>Your access will end on {endDate}</li>
                <li>You'll lose access to premium features</li>
              </ul>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
            >
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={executeCancelSubscription}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Yes, Cancel Subscription"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Auto-Renew Toggle Confirmation Dialog */}
      <Dialog open={autoRenewDialogOpen} onOpenChange={setAutoRenewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {confirmationAction === "disable-auto-renew" ? (
                <>
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                  Disable Auto-Renewal
                </>
              ) : (
                <>
                  <RefreshCw className="h-5 w-5 text-green-500 mr-2" />
                  Enable Auto-Renewal
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {confirmationAction === "disable-auto-renew"
                ? "Are you sure you want to disable automatic renewal for your subscription?"
                : "Are you sure you want to enable automatic renewal for your subscription?"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {confirmationAction === "disable-auto-renew" ? (
              <div className="space-y-3">
                <p>If you disable auto-renewal:</p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Your subscription will remain active until {endDate}</li>
                  <li>You won't be charged again after this period</li>
                  <li>Your access will automatically end on {endDate}</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-3">
                <p>If you enable auto-renewal:</p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>
                    Your subscription will automatically renew on {endDate}
                  </li>
                  <li>
                    You'll continue to be charged based on your current plan
                  </li>
                  <li>You can cancel anytime before the renewal date</li>
                </ul>
              </div>
            )}
          </div>
          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setAutoRenewDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant={
                confirmationAction === "disable-auto-renew"
                  ? "warning"
                  : "default"
              }
              onClick={executeToggleAutoRenew}
              disabled={isTogglingAutoRenew}
              className={
                confirmationAction === "disable-auto-renew"
                  ? "bg-amber-500 hover:bg-amber-600 text-white"
                  : ""
              }
            >
              {isTogglingAutoRenew ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : confirmationAction === "disable-auto-renew" ? (
                "Disable Auto-Renewal"
              ) : (
                "Enable Auto-Renewal"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
