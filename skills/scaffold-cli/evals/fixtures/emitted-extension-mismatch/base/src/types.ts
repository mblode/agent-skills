export interface Entry {
  title: string;
  date: string;
  body: string;
}

export interface Digest {
  weekOf: string;
  entries: Entry[];
}
