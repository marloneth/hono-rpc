import z from "zod";
import { memberRoles } from "../db/schema";

export type MemberRole = (typeof memberRoles)[number];

export const MemberSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1, "firstName is required"),
  lastName: z.string().min(1, "lastName is required"),
  userName: z.string().min(1, "userName is required"),
  email: z.email(),
  role: z.enum(memberRoles),
});

export const CreateMemberSchema = z.object({
  firstName: z.string().min(1, "firstName is required"),
  lastName: z.string().min(1, "lastName is required"),
  userName: z.string().min(1, "userName is required"),
  email: z.email(),
  password: z.string().min(1, "password is required"),
  role: z.enum(memberRoles),
});

export const UpdateMemberSchema = z.object({
  firstName: z.string().min(1, "firstName is required").optional(),
  lastName: z.string().min(1, "lastName is required").optional(),
  userName: z.string().min(1, "userName is required").optional(),
  email: z.email().optional(),
  password: z.string().min(1, "password is required").optional(),
  role: z.enum(memberRoles).optional(),
});

export const QueryMembersSchema = z.object({
  role: z.enum(memberRoles).optional(),
  search: z.string().optional(),
  sort: z
    .enum(["role", "email", "firstName", "lastName", "userName"])
    .optional(),
  order: z.enum(["asc", "desc"]).default("asc"),
});
