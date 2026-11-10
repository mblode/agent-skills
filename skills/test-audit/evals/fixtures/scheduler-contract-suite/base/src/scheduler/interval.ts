const UNIT_MS: Record<string, number> = {
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
};

export function parseInterval(text: string): number {
  const match = /^every (\d+)([mhd])$/.exec(text.trim());
  if (!match) {
    throw new SyntaxError(`cannot read interval "${text}", expected a form like "every 15m"`);
  }
  const count = Number(match[1]);
  if (count === 0) {
    throw new RangeError("an interval of zero would run the job continuously");
  }
  return count * UNIT_MS[match[2]];
}

export interface JobState {
  jobId: string;
  nextRunAt: Date;
}

export function serializeState(state: JobState): string {
  return JSON.stringify({ job_id: state.jobId, next_run_at: state.nextRunAt.toISOString() });
}

export function loadState(text: string): JobState {
  const raw = JSON.parse(text) as { job_id: string; next_run_at: string };
  return { jobId: raw.job_id, nextRunAt: new Date(raw.next_run_at) };
}
