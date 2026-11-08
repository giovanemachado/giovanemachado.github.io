export const starsFor = (rating: number): string => {
  const clamped = Math.min(5, Math.max(1, rating));
  return '★'.repeat(clamped) + '☆'.repeat(5 - clamped);
};
