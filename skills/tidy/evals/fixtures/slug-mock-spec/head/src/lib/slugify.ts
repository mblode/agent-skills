export interface SlugOptions {
  maxLength?: number;
}

export function slugify(title: string, options: SlugOptions = {}): string {
  const slug = title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return options.maxLength ? slug.slice(0, options.maxLength) : slug;
}
