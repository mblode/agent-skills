import type { Workspace } from "./types.ts";

const UNITS = ["B", "KB", "MB", "GB", "TB"];

export function formatBytes(bytes: number): string {
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < UNITS.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${unit === 0 ? value : value.toFixed(1)} ${UNITS[unit]}`;
}

export function usageLabel(workspace: Workspace): string {
  return `${formatBytes(workspace.attachmentBytesUsed)} of attachments stored`;
}
