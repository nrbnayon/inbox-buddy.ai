// app\(main)\dashboard\components\EmailPagination.jsx
"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function EmailPagination({
  totalEmails,
  currentPage,
  onPageChange,
  emailsPerPage,
  hasNextPage,
  hasPrevPage,
}) {
  const totalPages = Math.max(1, Math.ceil(totalEmails / emailsPerPage));

  const handlePrevious = () => {
    if (hasPrevPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNextPage) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1); // Always show first page

      if (currentPage <= 3) {
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
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
              className={`hover:link-btn hover:border-transparent border bg-white border-[#101010] ${
                !hasPrevPage ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!hasPrevPage}
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
                    onPageChange(Number(page));
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
              className={`hover:link-btn hover:border-transparent border bg-white border-[#101010] ${
                !hasNextPage ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!hasNextPage}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}