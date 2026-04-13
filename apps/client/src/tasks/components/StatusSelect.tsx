import type { TaskStatus } from "../api/tasks";

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "backlog", label: "Backlog" },
  { value: "ready_for_development", label: "Ready for dev" },
  { value: "in_progress", label: "In progress" },
  { value: "code_review", label: "Code review" },
  { value: "testing", label: "Testing" },
  { value: "ready_for_release", label: "Ready for release" },
  { value: "done", label: "Done" },
  { value: "blocked", label: "Blocked" },
];

interface StatusSelectProps {
  value: TaskStatus | undefined;
  onChange: (value: TaskStatus | undefined) => void;
  includeAll?: boolean;
  className?: string;
}

export function StatusSelect({
  value,
  onChange,
  includeAll = false,
  className,
}: StatusSelectProps) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) =>
        onChange(
          e.target.value === "" ? undefined : (e.target.value as TaskStatus),
        )
      }
      className={className}
    >
      {includeAll && <option value="">All</option>}
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
