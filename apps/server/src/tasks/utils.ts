import type { Task } from "./types";

export const parseDate = (date?: string) => {
  if (!date) return null;

  const parsed = new Date(date);
  return isNaN(parsed.getTime()) ? null : parsed;
};

export const sorters = {
  title: (a: Task, b: Task) => a.title.localeCompare(b.title),
  completed: (a: Task, b: Task) => Number(a.completed) - Number(b.completed),
  dueDate: (a: Task, b: Task) => {
    const aDate = parseDate(a.dueDate);
    const bDate = parseDate(b.dueDate);

    if (!aDate && !bDate) return 0;
    if (!aDate) return 1;
    if (!bDate) return -1;

    return aDate.getTime() - bDate.getTime();
  },
};
