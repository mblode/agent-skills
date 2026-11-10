export interface Job<Payload = unknown> {
  id: string;
  type: string;
  payload: Payload;
  attempt: number;
}

export type JobHandler<Payload = never> = (payload: Payload) => Promise<void>;

export interface Queue {
  reserve(): Promise<Job | null>;
  ack(jobId: string): Promise<void>;
  enqueue(job: Job, delayMs?: number): Promise<void>;
  deadLetter(job: Job, reason: string): Promise<void>;
}
