import type { Task } from "./types";

export const parseDate = (date?: string) => {
  if (!date) return null;

  const parsed = new Date(date);
  return isNaN(parsed.getTime()) ? null : parsed;
};
