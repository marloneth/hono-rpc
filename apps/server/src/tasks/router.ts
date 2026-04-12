import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { CreateTaskSchema, QuerySchema, UpdateTaskSchema } from "./schemas";
import { UuidParamSchema } from "../shared/schemas";
import {
  getTaskListHandler,
  getOverdueTasksHandler,
  createTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
} from "./handlers";

export const tasksRouter = new Hono()
  .get("/", zValidator("query", QuerySchema), getTaskListHandler)
  .get("/overdue", getOverdueTasksHandler)
  .post("/", zValidator("json", CreateTaskSchema), createTaskHandler)
  .patch(
    "/:id",
    zValidator("param", UuidParamSchema),
    zValidator("json", UpdateTaskSchema),
    updateTaskHandler,
  )
  .delete("/:id", zValidator("param", UuidParamSchema), deleteTaskHandler);
