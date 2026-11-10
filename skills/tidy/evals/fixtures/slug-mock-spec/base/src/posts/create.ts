import { randomUUID } from "node:crypto";
import { excerpt } from "../lib/excerpt";
import { slugify } from "../lib/slugify";
import type { Post } from "./types";

export function createPost(title: string, body: string, takenSlugs: Set<string>): Post {
  const base = slugify(title);
  let slug = base;
  for (let suffix = 2; takenSlugs.has(slug); suffix += 1) {
    slug = `${base}-${suffix}`;
  }
  return { id: randomUUID(), title, slug, body, summary: excerpt(body) };
}
