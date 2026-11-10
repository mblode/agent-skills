//#region src/types.d.ts
interface Entry {
  title: string;
  date: string;
  body: string;
}
interface Digest {
  weekOf: string;
  entries: Entry[];
}
//#endregion
//#region src/index.d.ts
declare function buildDigest(entries: Entry[], weekOf: string): Digest;
declare function renderDigest(digest: Digest): string;
//#endregion
export { type Digest, type Entry, buildDigest, renderDigest };
