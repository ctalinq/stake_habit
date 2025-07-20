import { API_ADDRESS } from "./const";

export const startOfDay = (date: Date) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

export function roundTo(num: number, decimals: number) {
  return Number(num.toFixed(decimals));
}

export function getApiPath(path: string) {
  return `${API_ADDRESS}/${path}`;
}
