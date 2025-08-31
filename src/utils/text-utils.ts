export const truncateText = (text: string, maxWords: number): string =>
  text.split(' ').slice(0, maxWords).join(' ');
