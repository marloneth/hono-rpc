import type { Context } from "hono";
import { taskService } from "./services";
import { parseDate } from "./utils";

export async function getTaskListHandler(c: Context) {
  const { completed, from, to, sort, order } = c.req.valid("query");

  const tasks = await taskService.getTaskList({
    completed: completed !== undefined ? completed === "true" : undefined,
    from: parseDate(from) ?? undefined,
    to: parseDate(to) ?? undefined,
    sortBy: sort,
    order,
  });

  return c.json(tasks);
}

export async function getOverdueTasksHandler(c: Context) {
  const tasks = await taskService.getOverdueTasks();
  return c.json(tasks);
}

export async function createTaskHandler(c: Context) {
  const { title, dueDate } = c.req.valid("json");

  const task = await taskService.createTask({
    title,
    dueDate: parseDate(dueDate) ?? undefined,
  });

  return c.json(task, 201 as const);
}

export async function updateTaskHandler(c: Context) {
  const { id } = c.req.valid("param");
  const { dueDate, ...rest } = c.req.valid("json");

  const task = await taskService.updateTask(id, {
    ...rest,
    dueDate: parseDate(dueDate) ?? undefined,
  });

  if (!task) return c.json({ error: "Not found" }, 404 as const);

  return c.json(task);
}

export async function deleteTaskHandler(c: Context) {
  const { id } = c.req.valid("param");

  const task = await taskService.deleteTask(id);
  if (!task) return c.json({ error: "Not found" }, 404 as const);

  return c.json({ success: true });
}
