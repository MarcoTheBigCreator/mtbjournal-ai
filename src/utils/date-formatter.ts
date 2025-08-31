/**
 * Formats a date string into a more readable format.
 * @param {Date} dateString The date string to format.
 * @returns {string} The formatted date string.
 */
export const dateFormatter = (dateString: Date): string => {
  const date = new Date(dateString);
  return date.toDateString();
};
