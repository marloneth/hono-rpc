import { z } from "zod";
import {
  CreateMemberSchema,
  MemberSchema,
  UpdateMemberSchema,
} from "./schemas";

export type Member = z.infer<typeof MemberSchema>;
export type CreateMemberData = z.infer<typeof CreateMemberSchema>;
export type UpdateMemberData = z.infer<typeof UpdateMemberSchema>;
