import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType } from "hono/client";
import {
  assignMember,
  createTask,
  deleteTask,
  getTasks,
  removeMember,
  updateTask,
  type GetTasksRequestQuery,
} from "./api";
import type { client } from "../shared/api";

type UpdateTaskData = {
  id: string;
  data: InferRequestType<(typeof client.tasks)[":id"]["$patch"]>["json"];
};

export const useGetTaskList = (filters?: GetTasksRequestQuery) =>
  useQuery({
    queryKey: ["tasks", filters],
    queryFn: () => getTasks(filters),
  });

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: UpdateTaskData) => updateTask(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });
};

export const useAssignMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, memberId }: { taskId: string; memberId: string }) =>
      assignMember(taskId, memberId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });
};

export const useRemoveMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeMember,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });
};
