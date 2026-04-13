import type { InferRequestType, InferResponseType } from "hono/client";
import { client } from "../shared/api";

type GetTasksResponse = InferResponseType<typeof client.tasks.$get>;
type GetTasksRequest = InferRequestType<typeof client.tasks.$get>;
export type GetTasksRequestQuery = GetTasksRequest["query"];
export type TaskStatus = Exclude<GetTasksRequestQuery["status"], undefined>;

type CreateTaskRequest = InferRequestType<typeof client.tasks.$post>;
type CreateTaskResponse = InferResponseType<typeof client.tasks.$post, 201>;

type UpdateTaskRequest = InferRequestType<
  (typeof client.tasks)[":id"]["$patch"]
>;
type UpdateTaskSuccessResponse = InferResponseType<
  (typeof client.tasks)[":id"]["$patch"],
  200
>;

type AssignMemberRequest = InferRequestType<
  (typeof client.tasks)[":id"]["assignee"]["$put"]
>;

type ApiError = { error: string };

export type Task = GetTasksResponse[number];

const mapToQuery = (filters: GetTasksRequestQuery): GetTasksRequestQuery => {
  return {
    ...(filters.status && { status: filters.status }),
    ...(filters.ownerId !== undefined && {
      ownerId: filters.ownerId === "unassigned" ? "null" : filters.ownerId,
    }),
    ...(filters.from && { from: filters.from }),
    ...(filters.to && { to: filters.to }),
    ...(filters.sort && { sort: filters.sort }),
    ...(filters.order && { order: filters.order }),
  };
};

export const getTasks = async (
  filters?: GetTasksRequestQuery,
): Promise<GetTasksResponse> => {
  const query = filters ? mapToQuery(filters) : {};
  const res = await client.tasks.$get({ query });
  return res.json();
};

export const createTask = async (
  data: CreateTaskRequest["json"],
): Promise<CreateTaskResponse> => {
  const res = await client.tasks.$post({ json: data });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
};

export const updateTask = async (
  id: string,
  data: UpdateTaskRequest["json"],
): Promise<UpdateTaskSuccessResponse> => {
  const res = await client.tasks[":id"].$patch({ param: { id }, json: data });
  if (!res.ok) {
    const body = (await res.json()) as ApiError;
    throw new Error(body.error);
  }
  return res.json();
};

export const deleteTask = async (id: string): Promise<void> => {
  const res = await client.tasks[":id"].$delete({ param: { id } });
  if (!res.ok) {
    const body = (await res.json()) as ApiError;
    throw new Error(body.error);
  }
};

export const assignMember = async (
  taskId: string,
  memberId: AssignMemberRequest["json"]["memberId"],
): Promise<UpdateTaskSuccessResponse> => {
  const res = await client.tasks[":id"].assignee.$put({
    param: { id: taskId },
    json: { memberId },
  });
  if (!res.ok) {
    const body = (await res.json()) as ApiError;
    throw new Error(body.error);
  }
  return res.json();
};

export const removeMember = async (
  taskId: string,
): Promise<UpdateTaskSuccessResponse> => {
  const res = await client.tasks[":id"].assignee.$delete({
    param: { id: taskId },
  });
  if (!res.ok) {
    const body = (await res.json()) as ApiError;
    throw new Error(body.error);
  }
  return res.json();
};
