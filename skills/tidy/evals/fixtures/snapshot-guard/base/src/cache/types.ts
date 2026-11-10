export interface Entry {
  id: string;
  value: number;
  expiresAt: number;
}

export interface Snapshot {
  entries: Entry[];
  builtAt: number;
}
