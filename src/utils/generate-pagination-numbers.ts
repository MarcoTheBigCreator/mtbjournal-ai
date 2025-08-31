/**
 * Generates an array of pagination numbers based on the current page and total pages.
 * If there are more than 7 pages, it will show ellipses.
 * @param {number} currentPage The current page number.
 * @param {number} totalPages The total number of pages.
 * @returns {Array<number | string>} An array of pagination numbers and ellipses.
 */
export const generatePaginationNumbers = (
  currentPage: number,
  totalPages: number
): Array<number | string> => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  if (currentPage > totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};
