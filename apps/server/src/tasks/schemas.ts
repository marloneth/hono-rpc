import z from "zod";

export const DueDateSchema = z.iso
  .datetime()
  .refine((date) => new Date(date) > new Date(), {
    message: "Due date must be in the future",
  });

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
  dueDate: DueDateSchema.optional(),
});

export const CreateTaskSchema = z.object({
  title: z.string().min(1),
  dueDate: DueDateSchema.optional(),
});

export const UpdateTaskSchema = z.object({
  title: z.string().optional(),
  completed: z.boolean().optional(),
  dueDate: DueDateSchema.optional(),
});

export const QuerySchema = z.object({
  completed: z.enum(["true", "false"]).optional(),
  from: z.iso.datetime().optional(),
  to: z.iso.datetime().optional(),
  sort: z.enum(["dueDate", "title", "completed"]).optional(),
  order: z.enum(["asc", "desc"]).default("asc"),
});
