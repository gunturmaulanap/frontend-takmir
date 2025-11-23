'use client'

import { FC } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationControlsProps {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  perPage?: number;
}

const PaginationControls: FC<PaginationControlsProps> = ({
  hasNextPage,
  hasPrevPage,
  totalPages,
  currentPage,
  onPageChange,
  perPage = 12,
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      // Show all pages if total pages is 7 or less
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // For larger page counts, show limited pages with ellipsis
    const pages = new Set<number>();

    // Always show first and last page
    pages.add(1);
    pages.add(totalPages);

    // Show pages around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.add(i);
    }

    return Array.from(pages).sort((a, b) => a - b);
  };

  const pageNumbers = getPageNumbers();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => {
              e.preventDefault();
              if (hasPrevPage) {
                onPageChange(currentPage - 1);
              }
            }}
            href="#"
            className={!hasPrevPage ? "pointer-events-none opacity-50" : ""}
            size="default"
          />
        </PaginationItem>

        {pageNumbers.map((pageNum, index) => {
          // Check if we need to show ellipsis before this page number
          if (index > 0 && pageNumbers[index - 1] !== pageNum - 1) {
            return (
              <div key={`wrapper-${pageNum}`}>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(pageNum);
                    }}
                    href="#"
                    size="icon"
                    isActive={currentPage === pageNum}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              </div>
            );
          }

          return (
            <PaginationItem key={pageNum}>
              <PaginationLink
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(pageNum);
                }}
                href="#"
                size="icon"
                isActive={currentPage === pageNum}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            onClick={(e) => {
              e.preventDefault();
              if (hasNextPage) {
                onPageChange(currentPage + 1);
              }
            }}
            href="#"
            className={!hasNextPage ? "pointer-events-none opacity-50" : ""}
            size="default"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationControls;