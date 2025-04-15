"use client";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function EmailPagination({ totalEmails, currentPage, setCurrentPage }) {
  const totalPages = Math.ceil(totalEmails / 6); // Assuming 6 emails per page

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

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 1) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col items-center xl:items-end gap-2 w-full">
      <p className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </p>
      <Pagination className="w-fit mx-0 mt-2 md:mt-0 mb-4 md:mb-0">
        <PaginationContent className="gap-2 md:gap-4">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePrevious();
              }}
              className="hover:link-btn hover:border-transparent border bg-white border-[#101010]"
              aria-disabled={currentPage === 1}
            />
          </PaginationItem>

          {getPageNumbers().map((page, index) => (
            <PaginationItem key={index}>
              {page === "..." ? (
                <span className="px-4 py-2">...</span>
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(Number(page));
                  }}
                  isActive={currentPage === page}
                  className={
                    currentPage === page
                      ? "link-btn"
                      : "hover:link-btn hover:border-transparent border bg-white border-[#101010]"
                  }
                >
                  {String(page)}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNext();
              }}
              className="hover:link-btn hover:border-transparent border bg-white border-[#101010]"
              aria-disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
