import { Hono } from "hono";
import {
  getTaskListHandler,
  getOverdueTasksHandler,
  createTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
  assignMemberToTaskHandler,
  removeMemberFromTaskHandler,
} from "./handlers";

export const tasksRouter = new Hono()
  .get("/", ...getTaskListHandler)
  .get("/overdue", ...getOverdueTasksHandler)
  .post("/", ...createTaskHandler)
  .put("/:id/assignee", ...assignMemberToTaskHandler)
  .patch("/:id", ...updateTaskHandler)
  .delete("/:id", ...deleteTaskHandler)
  .delete("/:id/assignee", ...removeMemberFromTaskHandler);
