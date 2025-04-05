// app\(main)\chat\components\ChatHeader.jsx
"use client";

import { useEffect } from "react";
import { useChat } from "./ChatContext";
import Link from "next/link";
import { getAvailableModels, getDefaultModel } from "@/lib/api/chat";
import { AiModelSelect } from "./AiModelSelect";

export default function ChatHeader() {
  const { selectedModel, setSelectedModel,  models, setModels } =
    useChat();

  useEffect(() => {
    const loadModels = async () => {
      try {
        // Fetch available models
        const modelData = await getAvailableModels();

        console.log("Available models in header:::", modelData);

        // Format models for dropdown
        const formattedModels = modelData.map((model) => ({
          label: model.name,
          value: model?.modelId || model.id,
          description: model.description,
          id: model.id,
        }));

        setModels(formattedModels);

        // If no model is selected, try to get the default model
        if (!selectedModel) {
          try {
            const defaultModel = await getDefaultModel();
            const defaultModelFormatted = {
              label: defaultModel.name,
              value: defaultModel.id,
              description: defaultModel.description,
              id: defaultModel.id,
              ...defaultModel, // Keep all original properties
            };
            setSelectedModel(defaultModelFormatted);
            console.log("Set default model:", defaultModelFormatted);
          } catch (error) {
            // If default model fetch fails, use the first available model
            if (formattedModels.length > 0) {
              setSelectedModel(formattedModels[0]);
              console.log("Set first available model:", formattedModels[0]);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load AI models:", error);
      }
    };

    loadModels();
  }, []);

  const handleModelChange = (value) => {
    // Find the full model object that matches the selected value
    const selectedModelObj = models.find((model) => model.value === value);

    if (selectedModelObj) {
      console.log("Model changed to:", selectedModelObj);
      // Use setTimeout to ensure state update happens after current execution
      setTimeout(() => {
        setSelectedModel(selectedModelObj);
      }, 0);
    } else {
      // Fallback if model not found
      const fallbackModel = {
        value,
        label: value,
        id: value,
      };
      console.log("Model not found in list, using fallback:", fallbackModel);
      setSelectedModel(fallbackModel);
    }
  };

  return (
    <div className='bg-[#F1F1F1] flex flex-col sm:flex-row justify-between items-center p-3 lg:p-6 rounded-lg mb-3 lg:mb-6 sticky top-0 gap-3'>
      <div className='flex items-center gap-4 w-full sm:w-auto'>
        <AiModelSelect
          title='Select a Model'
          label='Models'
          className='border-none w-[180px]'
          seperator={true}
          value={selectedModel?.value || selectedModel?.id || ""}
          onChange={handleModelChange}
          options={models.map((model) => ({
            label: model.label,
            value: model.value || model.id,
            description: model.description,
          }))}
        />
      </div>
      <Link
        href='/pricing'
        className='text-white px-6 lg:px-10 py-3 lg:py-3 rounded-lg lg:rounded-xl link-btn w-full sm:w-auto text-center'
      >
        Upgrade Plan
      </Link>
    </div>
  );
}