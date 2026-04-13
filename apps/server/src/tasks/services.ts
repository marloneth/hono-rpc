import { memberDaos } from "../members/daos";
import { taskDaos, TaskSortField } from "./daos";
import { TaskStatus } from "./schemas";

interface GetTaskListParams {
  status?: TaskStatus;
  ownerId?: string | null;
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

async function assignMemberToTask(taskId: string, memberId: string) {
  const [member, task] = await Promise.all([
    memberDaos.getMemberById(memberId),
    taskDaos.getTaskById(taskId),
  ]);

  if (!member || !task) return { member, task: null };

  const updated = await taskDaos.assignMemberToTask(taskId, memberId);
  return { member, task: updated };
}

function deleteTask(id: string) {
  return taskDaos.deleteTask(id);
}

async function removeMemberFromTask(taskId: string) {
  const task = await taskDaos.getTaskById(taskId);

  if (!task) return { found: false, hadAssignee: false };
  if (!task.ownerId) return { found: true, hadAssignee: false };

  const updated = await taskDaos.removeMemberFromTask(taskId);
  return { found: true, hadAssignee: true, task: updated };
}

export const taskService = {
  getTaskList,
  getOverdueTasks,
  createTask,
  updateTask,
  assignMemberToTask,
  deleteTask,
  removeMemberFromTask,
};
