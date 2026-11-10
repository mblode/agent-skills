export interface PendingChange {
  id: string;
  docId: string;
  body: string;
  editedAt: number;
}

export class ChangeQueue {
  private pending: PendingChange[] = [];
  private dropped: Array<{ id: string; reason: string }> = [];

  push(change: PendingChange): void {
    this.pending.push(change);
  }

  take(limit: number): PendingChange[] {
    return this.pending.slice(0, limit);
  }

  ack(id: string): void {
    this.pending = this.pending.filter((change) => change.id !== id);
  }

  discard(id: string, reason: string): void {
    this.ack(id);
    this.dropped.push({ id, reason });
  }

  get droppedCount(): number {
    return this.dropped.length;
  }
}
