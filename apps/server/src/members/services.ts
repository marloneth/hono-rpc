import bcrypt from "bcrypt";

import { memberDaos, MemberSortField } from "./daos";
import { MemberRole } from "./schemas";
import { CreateMemberData, UpdateMemberData } from "./types";

interface GetMemberListParams {
  role?: MemberRole;
  search?: string;
  sortBy?: MemberSortField;
  order: "asc" | "desc";
}

function getMemberList({ sortBy, order, ...filters }: GetMemberListParams) {
  return memberDaos.getMemberList(filters, { sortBy, order });
}

async function createMember(data: CreateMemberData) {
  const hashed = await bcrypt.hash(data.password, 10);
  return memberDaos.createMember({ ...data, password: hashed });
}

async function updateMember(id: string, data: UpdateMemberData) {
  if (data.password) {
    data = { ...data, password: await bcrypt.hash(data.password, 10) };
  }

  return memberDaos.updateMember(id, data);
}

function deleteMember(id: string) {
  return memberDaos.deleteMember(id);
}

export const memberService = {
  getMemberList,
  createMember,
  updateMember,
  deleteMember,
};
