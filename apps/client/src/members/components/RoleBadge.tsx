import type { MemberRole } from "../api";

const ROLE_CONFIG: Record<MemberRole, { label: string; className: string }> = {
  developer: {
    label: "Developer",
    className: "bg-blue-100 text-blue-700",
  },
  tech_lead: {
    label: "Tech Lead",
    className: "bg-purple-100 text-purple-700",
  },
  qa_engineer: {
    label: "QA Engineer",
    className: "bg-yellow-100 text-yellow-700",
  },
  project_manager: {
    label: "Project Manager",
    className: "bg-green-100 text-green-700",
  },
};

interface RoleBadgeProps {
  role: MemberRole;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const { label, className } = ROLE_CONFIG[role];

  return (
    <span className={`${className} text-xs font-medium px-2 py-0.5 rounded-full`}>
      {label}
    </span>
  );
}
