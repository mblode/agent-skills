function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderBody(markdown) {
  return markdown
    .split(/\n{2,}/)
    .map((block) => {
      if (block.startsWith("## ")) return `<h2>${escapeHtml(block.slice(3))}</h2>`;
      if (block.startsWith("```")) return `<pre><code>${escapeHtml(block.replace(/```\w*\n?/g, "").trimEnd())}</code></pre>`;
      if (block.startsWith("- ")) {
        const items = block.split("\n").map((line) => `<li>${escapeHtml(line.slice(2))}</li>`);
        return `<ul>${items.join("")}</ul>`;
      }
      return `<p>${escapeHtml(block)}</p>`;
    })
    .join("\n");
}

export function renderMarkdown(page) {
  return `# ${page.title}\n\n${page.body}\n`;
}

export function renderHtml(page, pages) {
  const nav = [...pages.values()]
    .sort((a, b) => a.order - b.order)
    .map((entry) => `<li><a href="/docs/${entry.slug}">${escapeHtml(entry.title)}</a></li>`)
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(page.title)} | Ember Atlas docs</title>
<link rel="llms-txt" href="/llms.txt">
<link rel="stylesheet" href="/docs.css">
</head>
<body>
<header><a href="/docs/overview">Ember Atlas docs</a></header>
<nav aria-label="Documentation"><ul>${nav}</ul></nav>
<main>
<h1>${escapeHtml(page.title)}</h1>
${renderBody(page.body)}
</main>
<footer><p>Ember Atlas maps wildfire risk for land managers.</p></footer>
</body>
</html>
`;
}
