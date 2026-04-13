import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import { taskService } from "./services";
import { parseDate } from "./utils";
import { CreateTaskSchema, QueryTasksSchema, UpdateTaskSchema } from "./schemas";
import { UuidParamSchema } from "../shared/schemas";

const factory = createFactory();

export const getTaskListHandler = factory.createHandlers(
  zValidator("query", QueryTasksSchema),
  async (c) => {
    const { status, from, to, sort, order } = c.req.valid("query");

    const tasks = await taskService.getTaskList({
      status,
      from: parseDate(from) ?? undefined,
      to: parseDate(to) ?? undefined,
      sortBy: sort,
      order,
    });

    return c.json(tasks);
  },
);

export const getOverdueTasksHandler = factory.createHandlers(async (c) => {
  const tasks = await taskService.getOverdueTasks();
  return c.json(tasks);
});

export const createTaskHandler = factory.createHandlers(
  zValidator("json", CreateTaskSchema),
  async (c) => {
    const { title, dueDate, ownerId } = c.req.valid("json");
    const creatorId = "00000000-0000-0000-0000-000000000000";

    const task = await taskService.createTask({
      title,
      ownerId,
      creatorId,
      dueDate: parseDate(dueDate) ?? undefined,
    });

    return c.json(task, 201 as const);
  },
);

export const updateTaskHandler = factory.createHandlers(
  zValidator("param", UuidParamSchema),
  zValidator("json", UpdateTaskSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const { dueDate, ...rest } = c.req.valid("json");

    const task = await taskService.updateTask(id, {
      ...rest,
      dueDate: parseDate(dueDate) ?? undefined,
    });

    if (!task) return c.json({ error: "Not found" }, 404 as const);

    return c.json(task);
  },
);

export const deleteTaskHandler = factory.createHandlers(
  zValidator("param", UuidParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");

    const task = await taskService.deleteTask(id);
    if (!task) return c.json({ error: "Not found" }, 404 as const);

    return c.json({ success: true });
  },
);
