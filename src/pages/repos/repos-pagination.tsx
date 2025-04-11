import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { FC, memo, useMemo } from "react";

interface ReposPaginationProps {
  currentPage: number;
  perPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

const ReposPagination: FC<ReposPaginationProps> = ({
  currentPage,
  perPage,
  totalCount,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalCount / perPage);


  const pageNumbers = useMemo<Array<number | 'ellipsis'>>(() => {
    const pages = [];

    pages.push(1);

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    const sortedPages = [...new Set(pages)].sort((a, b) => a - b);
    const result: Array<number | "ellipsis"> = [];

    for (let i = 0; i < sortedPages.length; i++) {
      result.push(sortedPages[i]);

      if (
        i < sortedPages.length - 1 &&
        sortedPages[i + 1] - sortedPages[i] > 1
      ) {
        result.push("ellipsis");
      }
    }

    return result;
  }, [currentPage, totalPages]);
  
  if (totalPages <= 1 || pageNumbers.length <= 1) return null;

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) {
                onPageChange(currentPage - 1);
              }
            }}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {pageNumbers.map((page, index) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page);
                }}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) {
                onPageChange(currentPage + 1);
              }
            }}
            className={
              currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default memo(ReposPagination);
