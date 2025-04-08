// app\(main)\chat\components\ChatHeader.jsx
"use client";
import React, { useEffect } from "react";
import { useChat } from "./ChatContext";
import { getAvailableModels } from "@/lib/api/chat";
import Link from "next/link";

export default function ChatHeader() {
  const { selectedModel, setSelectedModel, models, setModels } = useChat();

  useEffect(() => {
    const loadModels = async () => {
      try {
        const modelData = await getAvailableModels();
        const formattedModels = modelData.map((model) => {
          return {
            label: model.name,
            value: model.id,
            id: model.id,
            description: model.description,
          };
        });
        setModels(formattedModels);

        // Set default model
        if (!selectedModel && formattedModels.length > 0) {
          const defaultModel =
            // formattedModels.find((m) => m.value === "gpt-4o-mini") ||
            formattedModels[1];
          setSelectedModel(defaultModel);
        }
      } catch (error) {
        console.error("Failed to load AI models:", error);
      }
    };

    loadModels();
  }, []);

  const handleModelChange = (e) => {
    const modelId = e.target.value;
    const selectedModelData = models.find((m) => m.value === modelId);
    // console.log("selected Model value:", selectedModelData);

    if (selectedModelData) {
      setSelectedModel({
        ...selectedModelData,
        id: modelId,
        value: modelId,
      });
    }
  };

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
        <Link
          href="/pricing"
          className="text-white px-6 lg:px-10 py-3 lg:py-3 rounded-lg lg:rounded-xl link-btn w-full sm:w-auto text-center"
        >
          Upgrade Plan
        </Link>
      </div>
    </div>
  );
}
