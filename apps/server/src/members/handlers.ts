import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import { memberService } from "./services";
import {
  CreateMemberSchema,
  QueryMembersSchema,
  UpdateMemberSchema,
} from "./schemas";
import { UuidParamSchema } from "../shared/schemas";

const factory = createFactory();

export const getMemberListHandler = factory.createHandlers(
  zValidator("query", QueryMembersSchema),
  async (c) => {
    const { role, search, sort, order } = c.req.valid("query");

    const members = await memberService.getMemberList({
      role,
      search,
      sortBy: sort,
      order,
    });

    return c.json(members);
  },
);

export const createMemberHandler = factory.createHandlers(
  zValidator("json", CreateMemberSchema),
  async (c) => {
    const data = c.req.valid("json");
    const member = await memberService.createMember(data);

    return c.json(member, 201 as const);
  },
);

export const updateMemberHandler = factory.createHandlers(
  zValidator("param", UuidParamSchema),
  zValidator("json", UpdateMemberSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");

    const member = await memberService.updateMember(id, data);

    if (!member) return c.json({ error: "Not found" }, 404 as const);

    return c.json(member);
  },
);

export const deleteMemberHandler = factory.createHandlers(
  zValidator("param", UuidParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");

    const member = await memberService.deleteMember(id);
    if (!member) return c.json({ error: "Not found" }, 404 as const);

    return c.json({ success: true });
  },
);
