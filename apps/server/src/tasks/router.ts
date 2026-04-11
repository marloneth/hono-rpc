import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { CreateTaskSchema, QuerySchema, UpdateTaskSchema } from "./schemas";
import { parseDate, sorters } from "./utils";
import type { Task } from "./types";
import { UuidParamSchema } from "../shared/schemas";

const tasks: Task[] = [];

export const tasksRouter = new Hono()
  .get("/", zValidator("query", QuerySchema), (c) => {
    const { completed, from, to, sort, order } = c.req.valid("query");

    const fromDate = parseDate(from);
    const toDate = parseDate(to);

    const result = tasks.filter((task) => {
      const due = parseDate(task.dueDate);

      if (
        completed !== undefined &&
        task.completed !== (completed === "true")
      ) {
        return false;
      }

      if (fromDate && (!due || due < fromDate)) {
        return false;
      }

      if (toDate && (!due || due > toDate)) {
        return false;
      }

      return true;
    });

    if (sort) {
      const sorter = sorters[sort];
      result.sort((a, b) => (order === "asc" ? sorter(a, b) : -sorter(a, b)));
    }

    return c.json(result);
  })
  .get("/overdue", (c) => {
    const now = new Date();

    const result = tasks.filter((task) => {
      if (!task.dueDate) return false;

      const due = new Date(task.dueDate);
      return due < now;
    });

    return c.json(result);
  })
  .post("/", zValidator("json", CreateTaskSchema), async (c) => {
    const { title, dueDate } = c.req.valid("json");

    const task: Task = {
      id: crypto.randomUUID(),
      title,
      dueDate,
      completed: false,
    };

    tasks.push(task);

    return c.json(task, 201 as const);
  })
  .patch(
    "/:id",
    zValidator("param", UuidParamSchema),
    zValidator("json", UpdateTaskSchema),
    async (c) => {
      const id = c.req.param("id");
      const body = c.req.valid("json");

      const task = tasks.find((t) => t.id === id);
      if (!task) return c.json({ error: "Not found" }, 404 as const);

      Object.assign(task, body);

      return c.json(task);
    },
  )
  .delete("/:id", zValidator("param", UuidParamSchema), (c) => {
    const id = c.req.param("id");

    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return c.json({ error: "Not found" }, 404 as const);

    tasks.splice(index, 1);

    return c.json({ success: true });
  });
