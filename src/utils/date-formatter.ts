/**
 * Formats a date string into a more readable format.
 * @param {Date} dateString The date string to format.
 * @returns {string} The formatted date string.
 */
export const dateFormatter = (dateString: Date): string => {
  const date = new Date(dateString);
  const dateStr = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const timeStr = date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${dateStr} - ${timeStr}`;
};

/**
 * Formats a date for the tooltip.
 * @param {Date} date The date to format.
 * @returns {string} The formatted date string.
 */
export const formatDateForTooltip = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
