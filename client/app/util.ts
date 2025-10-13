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

export const formatDate = (timeMs: number) => {
  const date = new Date(timeMs * 1000);

  return formatDateToString(date);
};

export function formatDateToString(date: Date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formatNumber = (n: number) => n.toString().padStart(2, "0");

  return `${formatNumber(day)}.${formatNumber(month)}.${year} ${formatNumber(
    hours
  )}:${formatNumber(minutes)}`;
}
