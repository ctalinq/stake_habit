export const startOfDay = (date: Date) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

export function roundTo(num: number, decimals: number) {
  return Number(num.toFixed(decimals));
}
