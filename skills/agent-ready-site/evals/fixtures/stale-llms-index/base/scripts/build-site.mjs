import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { marketingRoutes, site } from "../site.config.mjs";

const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "dist");
const contentDir = path.join(root, "content", "docs");

function parse(raw) {
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw);
  if (!match) throw new Error("missing front matter");
  const data = {};
  for (const line of match[1].split("\n")) {
    const index = line.indexOf(":");
    data[line.slice(0, index).trim()] = line.slice(index + 1).trim();
  }
  return { data, body: match[2].trim() };
}

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderHtml(page) {
  const paragraphs = page.body
    .split(/\n{2,}/)
    .map((block) => (block.startsWith("```") ? `<pre>${escapeHtml(block.replace(/```\w*\n?/g, ""))}</pre>` : `<p>${escapeHtml(block)}</p>`))
    .join("\n");
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>${escapeHtml(page.title)} | ${site.name} docs</title></head>
<body>
<main>
<h1>${escapeHtml(page.title)}</h1>
${paragraphs}
</main>
</body>
</html>
`;
}

async function loadPages() {
  const files = (await readdir(contentDir)).filter((file) => file.endsWith(".mdx")).sort();
  const pages = [];
  for (const file of files) {
    const { data, body } = parse(await readFile(path.join(contentDir, file), "utf8"));
    pages.push({
      slug: file.replace(/\.mdx$/, ""),
      title: data.title,
      description: data.description,
      order: Number(data.order ?? 99),
      draft: data.draft === "true",
      body,
    });
  }
  return pages.sort((a, b) => a.order - b.order);
}

const pages = await loadPages();
const published = pages.filter((page) => !page.draft);

await rm(out, { recursive: true, force: true });
await mkdir(path.join(out, "docs"), { recursive: true });

for (const page of published) {
  await writeFile(path.join(out, "docs", `${page.slug}.html`), renderHtml(page));
  await writeFile(path.join(out, "docs", `${page.slug}.md`), `# ${page.title}\n\n${page.body}\n`);
}

const urls = [...marketingRoutes, ...published.map((page) => `/docs/${page.slug}`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${site.origin}${url}</loc></url>`).join("\n")}
</urlset>
`;
await writeFile(path.join(out, "sitemap.xml"), sitemap);

await cp(path.join(root, "static"), out, { recursive: true });

console.log(`built ${published.length} docs pages, ${urls.length} sitemap urls`);
