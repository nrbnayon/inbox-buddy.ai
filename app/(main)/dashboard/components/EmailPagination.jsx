import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function EmailPagination() {
  return (
    <Pagination className="w-fit mx-0 mt-5 md:mt-0 mb-4 md:mb-0">
      <PaginationContent className="gap-4">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            className="hover:link-btn hover:border-transparent border bg-white  border-[#101010]"
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href="#"
            className="hover:link-btn hover:border-transparent border bg-white  border-[#101010]"
          >
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive className="link-btn">
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href="#"
            className="hover:link-btn hover:border-transparent border bg-white  border-[#101010]"
          >
            3
          </PaginationLink>
        </PaginationItem>
        {/* <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem> */}
        <PaginationItem>
          <PaginationNext
            href="#"
            className="hover:link-btn hover:border-transparent border bg-white  border-[#101010]"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
