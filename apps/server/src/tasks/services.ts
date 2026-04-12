import { taskDaos, TaskSortField } from "./daos";

interface GetTaskListParams {
  completed?: boolean;
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

function createTask(data: { title: string; dueDate?: Date }) {
  return taskDaos.createTask(data);
}

function updateTask(
  id: string,
  data: { title?: string; completed?: boolean; dueDate?: Date },
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
