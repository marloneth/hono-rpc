import type { InferRequestType, InferResponseType } from "hono/client";
import { client } from "./api";

type GetTasksResponse = InferResponseType<typeof client.tasks.$get>;
type GetTasksRequest = InferRequestType<typeof client.tasks.$get>;

type CreateTaskErrorResponse = InferResponseType<
  typeof client.tasks.$post,
  201
>;
type UpdateTaskSuccessResponse = InferResponseType<
  (typeof client.tasks)[":id"]["$patch"],
  200
>;

type ApiError = { error: string };

export type Task = GetTasksResponse[number];

export type TasksFilters = {
  completed?: boolean;
  from?: string;
  to?: string;
  sort?: "dueDate" | "title" | "completed";
  order?: "asc" | "desc";
};

const mapToQuery = (filters: TasksFilters): GetTasksRequest["query"] => {
  return {
    ...(filters.completed !== undefined && {
      completed: String(filters.completed) as "true" | "false",
    }),
    ...(filters.from && { from: filters.from }),
    ...(filters.to && { to: filters.to }),
    ...(filters.sort && { sort: filters.sort }),
    ...(filters.order && { order: filters.order }),
  };
};

export const getTasks = async (
  filters?: TasksFilters,
): Promise<GetTasksResponse> => {
  const query = filters ? mapToQuery(filters) : {};
  const res = await client.tasks.$get({ query });
  return res.json();
};

export const createTask = async (data: {
  title: string;
  dueDate?: string;
}): Promise<CreateTaskErrorResponse> => {
  const res = await client.tasks.$post({ json: data });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
};

export const updateTask = async (
  id: string,
  data: { title?: string; completed?: boolean; dueDate?: string },
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
