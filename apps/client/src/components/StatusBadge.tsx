import type { TaskStatus } from "../api/tasks";

const STATUS_CONFIG: Record<TaskStatus, { label: string; className: string }> = {
  backlog: {
    label: "Backlog",
    className: "bg-gray-100 text-gray-600",
  },
  ready_for_development: {
    label: "Ready for Dev",
    className: "bg-blue-100 text-blue-700",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-yellow-100 text-yellow-700",
  },
  code_review: {
    label: "Code Review",
    className: "bg-purple-100 text-purple-700",
  },
  testing: {
    label: "Testing",
    className: "bg-orange-100 text-orange-700",
  },
  ready_for_release: {
    label: "Ready for Release",
    className: "bg-teal-100 text-teal-700",
  },
  done: {
    label: "Done",
    className: "bg-green-100 text-green-700",
  },
  blocked: {
    label: "Blocked",
    className: "bg-red-100 text-red-700",
  },
};

interface StatusBadgeProps {
  status: TaskStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className } = STATUS_CONFIG[status];

  return (
    <span className={`${className} text-xs font-medium px-2 py-0.5 rounded-full`}>
      {label}
    </span>
  );
}
