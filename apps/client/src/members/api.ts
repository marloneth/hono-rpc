import type { InferRequestType, InferResponseType } from "hono/client";
import { client } from "../shared/api";

type GetMembersResponse = InferResponseType<typeof client.members.$get>;
type GetMembersRequest = InferRequestType<typeof client.members.$get>;
export type GetMembersRequestQuery = GetMembersRequest["query"];
export type MemberRole = Exclude<GetMembersRequestQuery["role"], undefined>;

type CreateMemberRequest = InferRequestType<typeof client.members.$post>;
type CreateMemberResponse = InferResponseType<typeof client.members.$post, 201>;

type UpdateMemberRequest = InferRequestType<
  (typeof client.members)[":id"]["$patch"]
>;
type UpdateMemberSuccessResponse = InferResponseType<
  (typeof client.members)[":id"]["$patch"],
  200
>;

type ApiError = { error: string };

export type Member = GetMembersResponse[number];

const mapToQuery = (
  filters: GetMembersRequestQuery,
): GetMembersRequestQuery => {
  return {
    ...(filters.role && { role: filters.role }),
    ...(filters.search && { search: filters.search }),
    ...(filters.sort && { sort: filters.sort }),
    ...(filters.order && { order: filters.order }),
  };
};

export const getMembers = async (
  filters?: GetMembersRequestQuery,
): Promise<GetMembersResponse> => {
  const query = filters ? mapToQuery(filters) : {};
  const res = await client.members.$get({ query });
  return res.json();
};

export const createMember = async (
  data: CreateMemberRequest["json"],
): Promise<CreateMemberResponse> => {
  const res = await client.members.$post({ json: data });
  if (!res.ok) throw new Error("Failed to create member");
  return res.json();
};

export const updateMember = async (
  id: string,
  data: UpdateMemberRequest["json"],
): Promise<UpdateMemberSuccessResponse> => {
  const res = await client.members[":id"].$patch({ param: { id }, json: data });
  if (!res.ok) {
    const body = (await res.json()) as ApiError;
    throw new Error(body.error);
  }
  return res.json();
};

export const deleteMember = async (id: string): Promise<void> => {
  const res = await client.members[":id"].$delete({ param: { id } });
  if (!res.ok) {
    const body = (await res.json()) as ApiError;
    throw new Error(body.error);
  }
};
