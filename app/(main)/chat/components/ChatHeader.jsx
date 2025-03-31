// app\(main)\chat\components\ChatHeader.jsx
import { SelectComponent } from "@/components/SelectComponent";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const aiModels = [
  {
    label: "Chat-GPT",
    value: "chatGpt",
  },
  {
    label: "Grok",
    value: "grok",
  },
  {
    label: "Deep Seek",
    value: "deepSeek",
  },
];

export default function ChatHeader() {
  return (
    <div className="bg-[#F1F1F1] flex justify-between items-center p-3 lg:p-6 rounded-lg mb-3 lg:mb-6 sticky top-0">
      <SelectComponent
        title="Select a Model"
        label="Models"
        className="border-none w-[180px]"
        seperator={true}
        options={aiModels}
      />
      <Link
        href="/pricing"
        // variant="blueGradient"
        className=" text-white px-6 lg:px-10 py-3 lg:py-3 rounded-lg lg:rounded-xl link-btn"
      >
        Upgrade Plan
      </Link>
    </div>
  );
}
