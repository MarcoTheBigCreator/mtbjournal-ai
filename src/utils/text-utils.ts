/**
 * Helper function that truncates text to the maximum word limit.
 * @param {string} text The text to truncate.
 * @param {number} maxWords The maximum number of words.
 * @returns {string} The truncated text.
 */
export const truncateText = (text: string, maxWords: number): string =>
  text.split(' ').slice(0, maxWords).join(' ');
