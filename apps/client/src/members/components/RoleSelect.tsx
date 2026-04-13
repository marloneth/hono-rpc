import type { MemberRole } from "../api";

const ROLE_OPTIONS: { value: MemberRole; label: string }[] = [
  { value: "developer", label: "Developer" },
  { value: "tech_lead", label: "Tech Lead" },
  { value: "qa_engineer", label: "QA Engineer" },
  { value: "project_manager", label: "Project Manager" },
];

interface RoleSelectProps {
  value: MemberRole | undefined;
  onChange: (value: MemberRole | undefined) => void;
  includeAll?: boolean;
  className?: string;
}

export function RoleSelect({
  value,
  onChange,
  includeAll = false,
  className,
}: RoleSelectProps) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) =>
        onChange(e.target.value === "" ? undefined : (e.target.value as MemberRole))
      }
      className={className}
    >
      {includeAll && <option value="">All roles</option>}
      {ROLE_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
