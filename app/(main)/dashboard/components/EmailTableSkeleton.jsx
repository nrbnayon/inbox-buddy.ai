"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function EmailTableSkeleton() {
  const skeletonRows = Array(7).fill(null);

  return (
    <div className="overflow-x-auto">
      {/* Desktop View */}
      <div className="hidden xl:block">
        <Table className="w-full">
          <TableHeader className="bg-gray-100">
            <TableRow className="font-bold border-b border-gray-300">
              <TableHead className="px-6 py-4 text-gray-700">
                Provider
              </TableHead>
              <TableHead className="text-gray-700">From</TableHead>
              <TableHead className="text-gray-700">Subject</TableHead>
              <TableHead className="text-gray-700">Date</TableHead>
              <TableHead className="hidden lg:table-cell text-gray-700">
                Latest Message Preview
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skeletonRows.map((_, idx) => (
              <TableRow
                key={idx}
                className="border-b border-gray-200 animate-pulse"
              >
                <TableCell className="py-4 pl-5 border-r border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-300 rounded-full" />
                    <div className="h-4 w-20 bg-gray-300 rounded" />
                  </div>
                </TableCell>
                <TableCell className="py-4 border-r border-gray-100">
                  <div className="h-4 w-32 bg-gray-300 rounded" />
                </TableCell>
                <TableCell className="border-r border-gray-100">
                  <div className="h-4 w-40 bg-gray-300 rounded" />
                </TableCell>
                <TableCell className="border-r border-gray-100">
                  <div className="h-4 w-24 bg-gray-300 rounded" />
                </TableCell>
                <TableCell className="hidden lg:table-cell pr-5">
                  <div className="h-4 w-48 bg-gray-300 rounded" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="block xl:hidden p-2 space-y-4">
        {skeletonRows.map((_, idx) => (
          <div
            key={idx}
            className="border rounded-lg p-4 bg-white shadow-sm animate-pulse space-y-2"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full" />
              <div className="h-4 w-24 bg-gray-300 rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-300 rounded" />
              <div className="h-4 w-40 bg-gray-300 rounded" />
              <div className="h-4 w-28 bg-gray-300 rounded" />
              <div className="h-4 w-48 bg-gray-300 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center xl:justify-end mt-6 mb-4">
        <div className="flex gap-2 animate-pulse">
          <div className="h-8 w-8 bg-gray-300 rounded-md" />
          <div className="h-8 w-8 bg-gray-300 rounded-md" />
          <div className="h-8 w-8 bg-gray-300 rounded-md" />
          <div className="h-8 w-8 bg-gray-300 rounded-md" />
          <div className="h-8 w-8 bg-gray-300 rounded-md" />
        </div>
      </div>
    </div>
  );
}
