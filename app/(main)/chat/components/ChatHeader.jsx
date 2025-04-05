// app\(main)\chat\components\ChatHeader.jsx
"use client";
import React, { useEffect } from "react";
import { useChat } from "./ChatContext";
import { getAvailableModels } from "@/lib/api/chat";

export default function ChatHeader() {
  const { selectedModel, setSelectedModel, models, setModels } = useChat();

  useEffect(() => {
    const loadModels = async () => {
      try {
        const modelData = await getAvailableModels();
        const formattedModels = modelData.map((model) => {
          console.log("Model data:", model);
          return {
            label: model.name,
            value: model.id,
            id: model.id, // Ensure we store the ID
            description: model.description,
          };
        });
        setModels(formattedModels);

        // Set default model
        if (!selectedModel && formattedModels.length > 0) {
          const defaultModel =
            formattedModels.find((m) => m.value === "gpt-4o-mini") ||
            formattedModels[0];
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
    console.log("selected Model value:", selectedModelData);

    if (selectedModelData) {
      setSelectedModel({
        ...selectedModelData,
        id: modelId, // Ensure ID is set
        value: modelId, // Ensure value is set
      });
    }
  };

  console.log(" Models :::", {
    selectedModel,
    setSelectedModel,
    models,
    setModels,
  });

  return (
    <div className='sticky top-0 z-10 bg-white border-b p-4'>
      <div className='flex items-center justify-between max-w-6xl mx-auto'>
        <select
          value={selectedModel?.value || selectedModel?.id || ""}
          onChange={handleModelChange}
          className='border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          <option value=''>Select a model</option>
          {models.map((model) => (
            <option key={model.value} value={model.value}>
              {model.label}
            </option>
          ))}
        </select>

        <button className='bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity'>
          Upgrade Plan
        </button>
      </div>
    </div>
  );
}
