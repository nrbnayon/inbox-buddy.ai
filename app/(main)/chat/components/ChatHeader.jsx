"use client";

import React, { useEffect, useState } from "react";
import { useChat } from "../../contexts/ChatContext";
import { getAvailableModels } from "@/lib/api/chat";
import PricingPlans from "../../../pricing/components/PricingPlans";
import SubscriptionDetails from "@/components/subscription/SubscriptionDetails";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getUserProfile } from "@/lib/api/user";

export default function ChatHeader({ accessToken }) {
  const { selectedModel, setSelectedModel, models, setModels } = useChat();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPricing, setShowPricing] = useState(false);

  useEffect(() => {
    const loadModelsAndUser = async () => {
      try {
        // Load AI models
        const modelData = await getAvailableModels();
        const formattedModels = modelData.map((model) => ({
          label: model.name,
          value: model.id,
          id: model.id,
          description: model.description,
        }));
        setModels(formattedModels);

        // Set default model
        if (!selectedModel && formattedModels.length > 0) {
          const defaultModel = formattedModels[1]; // Or your preferred default
          setSelectedModel(defaultModel);
        }

        // Load user profile to check subscription
        const userData = await getUserProfile(accessToken);
        setUser(userData.data);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadModelsAndUser();
  }, []);

  const handleModelChange = (e) => {
    const modelId = e.target.value;
    const selectedModelData = models.find((m) => m.value === modelId);

    if (selectedModelData) {
      setSelectedModel({
        ...selectedModelData,
        id: modelId,
        value: modelId,
      });
    }
  };

  const handleUpgradeClick = () => {
    setDialogOpen(true);
    setShowPricing(false); // Reset to default view (SubscriptionDetails if subscribed)
  };

  const handleUpgradeFromSubscription = () => {
    setShowPricing(true); // Switch to PricingPlans view
  };

  const isSubscribed = () =>
    user?.subscription?.status === "active" &&
    new Date(user?.subscription?.endDate) > new Date();

  return (
    <div className="bg-[#F1F1F1] mt-3 p-3 lg:p-6 rounded-lg mb-3 lg:mb-4 gap-3">
      <div className="w-full flex items-center justify-between gap-4 sm:w-auto">
        <select
          value={selectedModel?.value || selectedModel?.id || ""}
          onChange={handleModelChange}
          className="border rounded-lg px-2 py-2 focus:outline-none cursor-pointer"
        >
          <option value="">Select a model</option>
          {models.map((model) => (
            <option key={model.value} value={model.value}>
              {model.label}
            </option>
          ))}
        </select>
        <Button
          variant="blueGradient"
          onClick={handleUpgradeClick}
          className=" w-full sm:w-auto text-center"
        >
          Upgrade Plan
        </Button>
      </div>

      {/* Dialog for Pricing or Subscription Details */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:min-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {isSubscribed() && !showPricing
                ? "Your Subscription Details"
                : "Choose a Plan"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {isLoading ? (
              <div className="flex justify-center items-center p-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : isSubscribed() && !showPricing ? (
              <SubscriptionDetails onUpgrade={handleUpgradeFromSubscription} />
            ) : (
              <PricingPlans accessToken={accessToken} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
