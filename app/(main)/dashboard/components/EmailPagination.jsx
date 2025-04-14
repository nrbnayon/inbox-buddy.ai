"use client";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

export function EmailPagination({ totalEmails }) {
  const totalPages = Math.ceil(totalEmails / 6); // Assuming 6 emails per page
  const [currentPage, setCurrentPage] = useState(1); // Track current page

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle previous page
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle next page
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to determine which page numbers to show
  const getPageNumbers = () => {
    const pageNumbers = [];

    // Always show current page
    // Show 1 page before and 1 page after current page if they exist
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    // Show first page if we're not starting from page 1
    if (startPage > 1) {
      pageNumbers.push(1);
      // Add ellipsis if there's a gap
      if (startPage > 2) {
        pageNumbers.push("ellipsis-start");
      }
    }

    // Add the pages in our window
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Show last page if we're not ending at the last page
    if (endPage < totalPages) {
      // Add ellipsis if there's a gap
      if (endPage < totalPages - 1) {
        pageNumbers.push("ellipsis-end");
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="flex flex-col w-full items-center md:items-end justify-center">
      <div className="text-sm text-muted-foreground mb-2 sm:mb-0 block md:hidden">
        Page {currentPage} of {totalPages}
      </div>
      <Pagination className="w-fit mx-0">
        <PaginationContent className="gap-1 sm:gap-2">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePrevious();
              }}
              className={`hover:link-btn hover:border-transparent border bg-white border-[#101010] ${
                currentPage === 1 ? "opacity-50 pointer-events-none" : ""
              }`}
              aria-disabled={currentPage === 1}
            />
          </PaginationItem>

          {getPageNumbers().map((page, index) => {
            if (page === "ellipsis-start" || page === "ellipsis-end") {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page);
                  }}
                  isActive={currentPage === page}
                  className={
                    currentPage === page
                      ? "link-btn"
                      : "hover:link-btn hover:border-transparent border bg-white border-[#101010]"
                  }
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNext();
              }}
              className={`hover:link-btn hover:border-transparent border bg-white border-[#101010] ${
                currentPage === totalPages
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
              aria-disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
