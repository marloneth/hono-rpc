import { and, asc, desc, eq, gte, isNull, lt, lte } from "drizzle-orm";
import { db } from "../db";
import { tasksTable } from "../db/schema";
import { TaskStatus } from "./schemas";

export type TaskSortField = "title" | "status" | "dueDate";

interface TaskFilters {
  status?: TaskStatus;
  from?: Date;
  to?: Date;
}

interface TaskSorting {
  sortBy?: TaskSortField;
  order: "asc" | "desc";
}

async function getTaskList(filters: TaskFilters = {}, sorting: TaskSorting) {
  const conditions = [isNull(tasksTable.deletedAt)];

  if (filters.status) {
    conditions.push(eq(tasksTable.status, filters.status));
  }
  if (filters.from) {
    conditions.push(gte(tasksTable.dueDate, filters.from));
  }
  if (filters.to) {
    conditions.push(lte(tasksTable.dueDate, filters.to));
  }

  const query = db
    .select()
    .from(tasksTable)
    .where(and(...conditions));

  if (sorting.sortBy) {
    const direction = sorting.order === "asc" ? asc : desc;
    return query.orderBy(direction(tasksTable[sorting.sortBy]));
  }

  return query;
}

async function getOverdueTasks() {
  return db
    .select()
    .from(tasksTable)
    .where(
      and(isNull(tasksTable.deletedAt), lt(tasksTable.dueDate, new Date())),
    );
}

async function createTask(data: {
  title: string;
  creatorId: string;
  dueDate?: Date;
  ownerId?: string;
}) {
  const [task] = await db.insert(tasksTable).values(data).returning();
  return task;
}

async function updateTask(
  id: string,
  data: {
    title?: string;
    status?: TaskStatus;
    dueDate?: Date;
    ownerId?: string;
  },
) {
  const [task] = await db
    .update(tasksTable)
    .set(data)
    .where(and(isNull(tasksTable.deletedAt), eq(tasksTable.id, id)))
    .returning();
  return task ?? null;
}

async function deleteTask(id: string) {
  const [task] = await db
    .update(tasksTable)
    .set({ deletedAt: new Date() })
    .where(and(isNull(tasksTable.deletedAt), eq(tasksTable.id, id)))
    .returning();
  return task ?? null;
}

export const taskDaos = {
  getTaskList,
  getOverdueTasks,
  createTask,
  updateTask,
  deleteTask,
};
