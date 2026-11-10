import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const API = "https://api.harbor.example/v1/previews";

export async function upload({ dir, branch, token }) {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  const form = new FormData();
  form.set("branch", branch);
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const path = join(entry.parentPath, entry.name);
    form.set(relative(dir, path), new Blob([await readFile(path)]));
  }
  const response = await fetch(API, {
    method: "POST",
    headers: { authorization: `Bearer ${token}` },
    body: form,
  });
  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
  }
  return (await response.json()).url;
}
