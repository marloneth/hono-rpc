// Full class names are required so Tailwind includes them at build time
const COLORS = [
  "bg-red-400",
  "bg-orange-400",
  "bg-amber-400",
  "bg-lime-400",
  "bg-green-400",
  "bg-emerald-400",
  "bg-teal-400",
  "bg-cyan-400",
  "bg-sky-400",
  "bg-blue-400",
  "bg-indigo-400",
  "bg-violet-400",
  "bg-purple-400",
  "bg-fuchsia-400",
  "bg-pink-400",
  "bg-rose-400",
];

function getColorFromId(id: string): string {
  const sum = id
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return COLORS[sum % COLORS.length];
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

interface MemberAvatarProps {
  id: string;
  firstName: string;
  lastName: string;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-12 h-12 text-base",
};

export function MemberAvatar({
  id,
  firstName,
  lastName,
  size = "md",
}: MemberAvatarProps) {
  const color = getColorFromId(id);
  const initials = getInitials(firstName, lastName);

  return (
    <div
      className={`${color} ${SIZE_CLASSES[size]} rounded-full flex items-center justify-center font-semibold text-white shrink-0`}
    >
      {initials}
    </div>
  );
}
