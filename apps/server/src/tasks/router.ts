import { Hono } from "hono";
import {
  getTaskListHandler,
  getOverdueTasksHandler,
  createTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
} from "./handlers";

export const tasksRouter = new Hono()
  .get("/", ...getTaskListHandler)
  .get("/overdue", ...getOverdueTasksHandler)
  .post("/", ...createTaskHandler)
  .patch("/:id", ...updateTaskHandler)
  .delete("/:id", ...deleteTaskHandler);
