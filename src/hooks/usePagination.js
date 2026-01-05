
'use client';

import { useState, useCallback } from 'react';

export const usePagination = (initialPage = 1, itemsPerPage = 20) => {
  const [page, setPage] = useState(initialPage);
  const [totalItems, setTotalItems] = useState(0);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPage = useCallback((newPage) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    setPage(validPage);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(page + 1);
  }, [page, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(page - 1);
  }, [page, goToPage]);

  const canGoNext = page < totalPages;
  const canGoPrev = page > 1;

  return {
    page,
    totalPages,
    itemsPerPage,
    totalItems,
    setTotalItems,
    goToPage,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev,
    offset: (page - 1) * itemsPerPage
  };
};
