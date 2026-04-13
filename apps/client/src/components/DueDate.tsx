const DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: "seconds" },
  { amount: 60, unit: "minutes" },
  { amount: 24, unit: "hours" },
  { amount: 7, unit: "days" },
  { amount: 4.34, unit: "weeks" },
  { amount: 12, unit: "months" },
  { amount: Infinity, unit: "years" },
];

const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const dateFormatter = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" });

function getRelativeTime(date: Date): string {
  let duration = (date.getTime() - Date.now()) / 1000;

  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }

  return formatter.format(Math.round(duration), "years");
}

interface DueDateProps {
  date: string;
}

export function DueDate({ date }: DueDateProps) {
  const parsed = new Date(date);
  const isOverdue = parsed < new Date();

  const absolute = dateFormatter.format(parsed);
  const relative = getRelativeTime(parsed);

  return (
    <span className={`text-sm ${isOverdue ? "text-red-500" : "text-gray-400"}`}>
      {absolute} · {relative}
    </span>
  );
}
