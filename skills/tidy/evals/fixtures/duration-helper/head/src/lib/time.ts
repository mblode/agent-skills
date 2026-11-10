const DAY_MS = 24 * 60 * 60 * 1000;

export function startOfDay(timestamp: number): number {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

export function startOfWeek(timestamp: number): number {
  const day = new Date(timestamp).getDay();
  const sinceMonday = (day + 6) % 7;
  return startOfDay(timestamp) - sinceMonday * DAY_MS;
}

export function isSameDay(a: number, b: number): boolean {
  return startOfDay(a) === startOfDay(b);
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;

  let label = "";
  if (hours > 0) label += `${hours}h `;
  if (minutes > 0) label += `${minutes}m `;
  if (rest > 0) label += `${rest}s`;
  return label.trim();
}
