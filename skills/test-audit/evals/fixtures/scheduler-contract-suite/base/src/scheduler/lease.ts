export interface Journal {
  append(entry: string): void;
}

export class LeaseHeldError extends Error {
  constructor(jobId: string) {
    super(`job ${jobId} is already leased by another runner`);
    this.name = "LeaseHeldError";
  }
}

export class LeaseTable {
  private readonly held = new Set<string>();
  private readonly journal: Journal;

  constructor(journal: Journal) {
    this.journal = journal;
  }

  async runWithLease(jobId: string, job: () => Promise<void>): Promise<void> {
    if (this.held.has(jobId)) {
      throw new LeaseHeldError(jobId);
    }
    this.held.add(jobId);
    this.journal.append(`lease:${jobId}`);
    try {
      this.journal.append(`start:${jobId}`);
      await job();
      this.journal.append(`done:${jobId}`);
    } finally {
      this.held.delete(jobId);
      this.journal.append(`release:${jobId}`);
    }
  }
}

export function unfinishedJobs(entries: string[]): string[] {
  const leased = new Set<string>();
  for (const entry of entries) {
    const [kind, jobId] = entry.split(":");
    if (kind === "lease") {
      leased.add(jobId);
    }
    if (kind === "release") {
      leased.delete(jobId);
    }
  }
  return [...leased];
}
