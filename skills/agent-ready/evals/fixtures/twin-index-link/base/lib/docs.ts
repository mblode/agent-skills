import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export const SITE_URL = "https://quillharbor.example";

const CONTENT_DIR = path.join(process.cwd(), "content", "docs");

export interface Doc {
  slug: string;
  title: string;
  description: string;
  order: number;
  body: string;
}

export async function getDoc(slug: string): Promise<Doc | null> {
  if (!/^[a-z0-9-]+(\/[a-z0-9-]+)*$/.test(slug)) return null;
  try {
    const raw = await readFile(path.join(CONTENT_DIR, `${slug}.mdx`), "utf8");
    const { data, content } = matter(raw);
    return {
      slug,
      title: String(data.title),
      description: String(data.description ?? ""),
      order: Number(data.order ?? 99),
      body: content.trim(),
    };
  } catch {
    return null;
  }
}

export async function listDocs(): Promise<Doc[]> {
  const files = (await readdir(CONTENT_DIR)).filter((file) => file.endsWith(".mdx"));
  const docs = await Promise.all(files.map((file) => getDoc(file.replace(/\.mdx$/, ""))));
  return docs.filter((doc): doc is Doc => doc !== null).sort((a, b) => a.order - b.order);
}
