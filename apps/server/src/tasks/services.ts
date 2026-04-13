import { taskDaos, TaskSortField } from "./daos";
import { TaskStatus } from "./schemas";

interface GetTaskListParams {
  status?: TaskStatus;
  from?: Date;
  to?: Date;
  sortBy?: TaskSortField;
  order: "asc" | "desc";
}

function getTaskList({ sortBy, order, ...filters }: GetTaskListParams) {
  return taskDaos.getTaskList(filters, { sortBy, order });
}

function getOverdueTasks() {
  return taskDaos.getOverdueTasks();
}

function createTask(data: {
  title: string;
  creatorId: string;
  dueDate?: Date;
  ownerId?: string;
}) {
  return taskDaos.createTask(data);
}

function updateTask(
  id: string,
  data: {
    title?: string;
    status?: TaskStatus;
    dueDate?: Date;
    ownerId?: string;
  },
) {
  return taskDaos.updateTask(id, data);
}

function deleteTask(id: string) {
  return taskDaos.deleteTask(id);
}

export const taskService = {
  getTaskList,
  getOverdueTasks,
  createTask,
  updateTask,
  deleteTask,
};
