import z from "zod";
import { taskStatuses } from "../db/schema";

export type TaskStatus = (typeof taskStatuses)[number];

export const DueDateSchema = z.iso
  .datetime()
  .refine((date) => new Date(date) > new Date(), {
    message: "Due date must be in the future",
  });

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(taskStatuses),
  dueDate: DueDateSchema.optional(),
  creatorId: z.string(),
  ownerId: z.string().nullable(),
});

export const CreateTaskSchema = z.object({
  title: z.string().min(1),
  dueDate: DueDateSchema.optional(),
  ownerId: z.string().optional(),
});

export const UpdateTaskSchema = z.object({
  title: z.string().optional(),
  status: z.enum(taskStatuses).optional(),
  dueDate: DueDateSchema.optional(),
  ownerId: z.string().optional(),
});

export const AssignMemberToTaskSchema = z.object({
  memberId: z.string(),
});

export const QueryTasksSchema = z.object({
  status: z.enum(taskStatuses).optional(),
  ownerId: z.string().optional(),
  from: z.iso.datetime().optional(),
  to: z.iso.datetime().optional(),
  sort: z.enum(["dueDate", "title", "status"]).optional(),
  order: z.enum(["asc", "desc"]).default("asc"),
});
