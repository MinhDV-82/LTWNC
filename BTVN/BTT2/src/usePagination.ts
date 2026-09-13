import { useEffect, useMemo, useState } from "react";

export interface PaginationResult<T> {
  currentPage: number;
  totalPages: number;
  currentItems: T[];
  next: () => void;
  prev: () => void;
  goToPage: (page: number) => void;
}

export function usePagination<T>(
  items: T[],
  itemsPerPage: number,
): PaginationResult<T> {
  if (!Number.isInteger(itemsPerPage) || itemsPerPage < 1) {
    throw new Error("itemsPerPage must be a positive integer");
  }

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const [currentPage, setCurrentPage] = useState(1);

  const goToPage = (page: number) => {
    const validPage = Math.min(Math.max(Math.trunc(page), 1), totalPages);
    setCurrentPage(validPage);
  };

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, items, itemsPerPage]);

  return {
    currentPage,
    totalPages,
    currentItems,
    next: () => goToPage(currentPage + 1),
    prev: () => goToPage(currentPage - 1),
    goToPage,
  };
}