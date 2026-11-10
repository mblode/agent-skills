import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { site } from "../site.config.mjs";

const root = path.resolve(import.meta.dirname, "..");
const pagesDir = path.join(root, "pages");
const out = path.join(root, "dist");

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (entry.name.endsWith(".html")) files.push(full);
  }
  return files.sort();
}

function routeFor(file) {
  const relative = path.relative(pagesDir, file).replace(/\.html$/, "");
  return relative === "index" ? "/" : `/${relative}`;
}

function layout(title, body) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} | ${site.name}</title>
<link rel="stylesheet" href="/almanac.css">
</head>
<body>
<header><a href="/">${site.name}</a> <nav><a href="/guides/sowing-calendar">Guides</a> <a href="/about">About</a> <a href="/buy">Buy the almanac</a></nav></header>
<main>
${body}
</main>
<footer>${site.tagline}</footer>
</body>
</html>
`;
}

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

const routes = [];
for (const file of await walk(pagesDir)) {
  const source = await readFile(file, "utf8");
  const title = /<h1>(.*?)<\/h1>/.exec(source)?.[1] ?? site.name;
  const route = routeFor(file);
  const target = path.join(out, route === "/" ? "index.html" : `${route}.html`);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, layout(title, source.trim()));
  routes.push(route);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url><loc>${site.origin}${route}</loc></url>`).join("\n")}
</urlset>
`;
await writeFile(path.join(out, "sitemap.xml"), sitemap);

await cp(path.join(root, "public"), out, { recursive: true });

console.log(`built ${routes.length} pages`);
