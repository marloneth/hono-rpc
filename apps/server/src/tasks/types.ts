import { z } from "zod";
import { CreateTaskSchema, TaskSchema, UpdateTaskSchema } from "./schemas";

export type Task = z.infer<typeof TaskSchema>;
export type CreateTaskData = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskData = z.infer<typeof UpdateTaskSchema>;
