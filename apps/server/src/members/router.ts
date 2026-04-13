import { Hono } from "hono";
import {
  createMemberHandler,
  deleteMemberHandler,
  getMemberListHandler,
  updateMemberHandler,
} from "./handlers";

export const membersRouter = new Hono()
  .get("/", ...getMemberListHandler)
  .post("/", ...createMemberHandler)
  .patch("/:id", ...updateMemberHandler)
  .delete("/:id", ...deleteMemberHandler);
