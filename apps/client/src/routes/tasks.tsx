import { createFileRoute } from "@tanstack/react-router";
import TasksList from "../tasks/TasksList";

export const Route = createFileRoute("/tasks")({
  component: TasksList,
});
