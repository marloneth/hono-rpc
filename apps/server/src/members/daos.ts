import { and, asc, desc, eq, ilike, isNull, or } from "drizzle-orm";
import { MemberRole } from "./schemas";
import { membersTable } from "../db/schema";
import { db } from "../db";
import { CreateMemberData, UpdateMemberData } from "./types";

const memberColumns = {
  id: membersTable.id,
  firstName: membersTable.firstName,
  lastName: membersTable.lastName,
  userName: membersTable.userName,
  email: membersTable.email,
  role: membersTable.role,
  createdAt: membersTable.createdAt,
  updatedAt: membersTable.updatedAt,
  deletedAt: membersTable.deletedAt,
};

export type MemberSortField =
  | "firstName"
  | "lastName"
  | "userName"
  | "email"
  | "role";

interface MemberFilters {
  role?: MemberRole;
  search?: string;
}

interface TaskSorting {
  sortBy?: MemberSortField;
  order: "asc" | "desc";
}

async function getMemberList(
  filters: MemberFilters = {},
  sorting: TaskSorting,
) {
  const conditions = [isNull(membersTable.deletedAt)];

  if (filters.role) {
    conditions.push(eq(membersTable.role, filters.role));
  }

  if (filters.search) {
    const searchPattern = `%${filters.search}%`;

    const searchCondition = or(
      ilike(membersTable.firstName, searchPattern),
      ilike(membersTable.lastName, searchPattern),
      ilike(membersTable.userName, searchPattern),
    );

    if (searchCondition) conditions.push(searchCondition);
  }

  const query = db
    .select(memberColumns)
    .from(membersTable)
    .where(and(...conditions));

  if (sorting.sortBy) {
    const direction = sorting.order === "asc" ? asc : desc;
    return query.orderBy(direction(membersTable[sorting.sortBy]));
  }

  return query;
}

async function createMember(data: CreateMemberData) {
  const [member] = await db
    .insert(membersTable)
    .values(data)
    .returning(memberColumns);
  return member;
}

async function updateMember(id: string, data: UpdateMemberData) {
  const [member] = await db
    .update(membersTable)
    .set(data)
    .where(and(isNull(membersTable.deletedAt), eq(membersTable.id, id)))
    .returning(memberColumns);

  return member ?? null;
}

async function deleteMember(id: string) {
  const [member] = await db
    .update(membersTable)
    .set({ deletedAt: new Date() })
    .where(and(isNull(membersTable.deletedAt), eq(membersTable.id, id)))
    .returning(memberColumns);

  return member ?? null;
}

export const memberDaos = {
  getMemberList,
  createMember,
  updateMember,
  deleteMember,
};
