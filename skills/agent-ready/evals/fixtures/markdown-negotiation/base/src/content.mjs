import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const contentDir = path.resolve(import.meta.dirname, "..", "content");

function parse(raw) {
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw);
  const data = {};
  for (const line of match[1].split("\n")) {
    const index = line.indexOf(":");
    data[line.slice(0, index).trim()] = line.slice(index + 1).trim();
  }
  return { data, body: match[2].trim() };
}

export async function loadPages() {
  const files = (await readdir(contentDir)).filter((file) => file.endsWith(".mdx")).sort();
  const pages = new Map();
  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const { data, body } = parse(await readFile(path.join(contentDir, file), "utf8"));
    pages.set(slug, { slug, title: data.title, order: Number(data.order ?? 99), body });
  }
  return pages;
}
