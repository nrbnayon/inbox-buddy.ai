"use client";

import { Skeleton } from "@/components/ui/skeleton";

const SidebarProfileSkeleton = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-3 w-full ${className}`}>
      {/* Avatar skeleton */}
      <Skeleton className="h-10 w-10 rounded-full bg-white" />

      {/* Text content skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-32  bg-white" /> {/* Name placeholder */}
        <Skeleton className="h-3 w-40  bg-white" /> {/* Email placeholder */}
      </div>
    </div>
  );
};

export default SidebarProfileSkeleton;
