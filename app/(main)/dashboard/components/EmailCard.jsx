"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Archive, Trash2, MoreVertical } from "lucide-react";

export default function EmailCard() {
  return (
    <Card className="bg-[#E6E6E6] lg:min-h-28 p-4 w-full border-none shadow-none">
      <div className="hidden md:flex items-start gap-4">
        {/* Star icon on the left */}
        <div className="h-full flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mt-1 text-[#434343] hover:text-amber-500 cursor-pointer"
          >
            <Star size={22} strokeWidth={3} />
            <span className="sr-only">Star</span>
          </Button>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header with sender and date */}
          <div className="flex justify-between items-center mb-1">
            <div className="text-sm text-[#252525] font-medium">
              Vercel &lt;notifications@vercel.com&gt;
            </div>
            <div className="text-sm text-[#252525]">Mar 11, 2025</div>
          </div>

          {/* Notification title */}
          <h3 className="text-base font-medium text-[#1B1B1B] mb-1">
            Failed production deployment on team &apos;nrbnayon&apos;s project
          </h3>

          {/* Notification content */}
          <p className="text-sm text-[#101010]">
            The Bible&apos;s main message can be understood as God&apos;s plan
            for redemption and reconciliation with humanity. At its core, it
            tells the
          </p>
        </div>

        {/* Action buttons on the right */}
        <div className="flex h-full items-center gap-1 ml-2">
          <Button variant="ghost" size="icon" className="text-[#101010]">
            <Archive size={24} />
            <span className="sr-only">Archive</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-[#101010]">
            <Trash2 size={24} />
            <span className="sr-only">Delete</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-[#101010]">
            <MoreVertical size={24} />
            <span className="sr-only">More options</span>
          </Button>
        </div>
      </div>

      {/* mobile version */}
      <div className="flex flex-col md:hidden items-start gap-4">
        {/* star and contents */}
        <div className="flex">
          {/* Star icon on the left */}
          <div className="">
            <Button
              variant="ghost"
              size="icon"
              className="mt-3 text-[#434343] hover:text-amber-500 cursor-pointer"
            >
              <Star size={22} strokeWidth={3} />
              <span className="sr-only">Star</span>
            </Button>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Header with sender and date */}
            <div className="flex justify-between items-center mb-1">
              <div className="text-[12px] text-[#252525] font-medium">
                Vercel &lt;notifications@vercel.com&gt;
              </div>
            </div>

            {/* Notification title */}
            <h3 className="text-sm font-medium text-[#1B1B1B] mb-1">
              Failed production deployment on team...
            </h3>

            {/* Notification content */}
            <p className="text-sm text-[#101010]">
              The Bible&apos;s main message can be understood as God&apos;s
              plan...
            </p>
          </div>
        </div>

        {/* Action buttons ant time */}
        <div className="flex justify-between w-full items-center">
          {/* time */}
          <div className="text-sm ml-2 text-[#252525]">Mar 11, 2025</div>

          {/* action buttons */}
          <div className="flex h-full items-center gap-1 ml-2">
            <Button variant="ghost" size="icon" className="text-[#101010]">
              <Archive size={24} />
              <span className="sr-only">Archive</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-[#101010]">
              <Trash2 size={24} />
              <span className="sr-only">Delete</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-[#101010]">
              <MoreVertical size={24} />
              <span className="sr-only">More options</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
