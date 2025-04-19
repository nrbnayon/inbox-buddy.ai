// components/subscription/SubscriptionDetails.jsx
import { useState } from "react";
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
import { updateUserSubscription } from "@/lib/api/subscription";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Calendar, CheckCircle2, Loader2, RefreshCw } from "lucide-react";

export default function SubscriptionDetails({ onUpgrade }) {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!user) return null;

  const { subscription } = user;

  // Format dates
  const startDate = subscription?.startDate
    ? new Date(subscription.startDate).toLocaleDateString()
    : "N/A";

  const endDate = subscription?.endDate
    ? new Date(subscription.endDate).toLocaleDateString()
    : "N/A";

  // Check if subscription is active
  const isActive = subscription?.status === "active";

  // Determine subscription details based on plan
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
      dailyQueries: "Unlimited",
    },
  };

  const currentPlan = planDetails[subscription?.plan || "basic"];

  // Toggle auto-renew setting
  const toggleAutoRenew = async () => {
    setIsUpdating(true);
    try {
      await updateUserSubscription({
        autoRenew: !subscription.autoRenew,
      });
      await refreshUser();
      toast({
        title: "Settings updated",
        description: `Auto-renewal has been ${
          subscription.autoRenew ? "disabled" : "enabled"
        }.`,
      });
    } catch (error) {
      toast({
        title: "Failed to update settings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Manage your subscription details</CardDescription>
          </div>
          <Badge className={currentPlan.color}>{currentPlan.name}</Badge>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <div className='text-sm font-medium text-gray-500'>Status</div>
            <div className='flex items-center'>
              {isActive ? (
                <CheckCircle2 className='h-4 w-4 text-green-500 mr-2' />
              ) : (
                <span className='h-4 w-4 rounded-full bg-gray-300 mr-2' />
              )}
              <span>{isActive ? "Active" : "Inactive"}</span>
            </div>
          </div>

          <div className='space-y-2'>
            <div className='text-sm font-medium text-gray-500'>Daily Usage</div>
            <div>
              {subscription?.dailyQueries || 0} /{" "}
              {currentPlan.dailyQueries === "Unlimited"
                ? "∞"
                : currentPlan.dailyQueries}{" "}
              queries used
            </div>
          </div>

          <div className='space-y-2'>
            <div className='text-sm font-medium text-gray-500'>Start Date</div>
            <div className='flex items-center'>
              <Calendar className='h-4 w-4 mr-2 text-gray-400' />
              {startDate}
            </div>
          </div>

          <div className='space-y-2'>
            <div className='text-sm font-medium text-gray-500'>
              Renewal Date
            </div>
            <div className='flex items-center'>
              <RefreshCw className='h-4 w-4 mr-2 text-gray-400' />
              {endDate}
            </div>
          </div>

          <div className='space-y-2'>
            <div className='text-sm font-medium text-gray-500'>Max Inboxes</div>
            <div>{currentPlan.maxInboxes}</div>
          </div>

          <div className='space-y-2'>
            <div className='text-sm font-medium text-gray-500'>
              Current Inboxes
            </div>
            <div>{user.inboxList?.length || 0} connected</div>
          </div>
        </div>

        <div className='flex items-center justify-between pt-4 border-t'>
          <div>
            <div className='font-medium'>Auto-Renewal</div>
            <div className='text-sm text-gray-500'>
              Automatically renew your subscription
            </div>
          </div>
          <Switch
            checked={subscription?.autoRenew}
            onCheckedChange={toggleAutoRenew}
            disabled={isUpdating}
          />
        </div>
      </CardContent>
      <CardFooter className='flex justify-between'>
        <Button variant='outline' onClick={() => router.push("/pricing")}>
          View Plans
        </Button>
        <Button onClick={onUpgrade}>Upgrade Subscription</Button>
      </CardFooter>
    </Card>
  );
}
