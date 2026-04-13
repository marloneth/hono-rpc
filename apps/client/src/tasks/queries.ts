import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  type GetTasksRequestQuery,
} from "./api";

type UpdateTaskData = {
  id: string;
  data: Parameters<typeof updateTask>[1];
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
