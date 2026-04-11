import { z } from "zod";
import { TaskSchema } from "./schemas";

export type Task = z.infer<typeof TaskSchema>;
