export const dateFormatter = (dateString: Date) => {
  const date = new Date(dateString);
  return date.toDateString();
};
