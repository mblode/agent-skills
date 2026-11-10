import { listDocs, SITE_URL } from "@/lib/docs";

export async function GET() {
  const docs = await listDocs();

  const lines = [
    "# Quill Harbor",
    "",
    "> Quill Harbor sends transactional letters and postcards through an HTTP API.",
    "",
    "## Docs",
    "",
    ...docs.map((doc) => `- [${doc.title}](${SITE_URL}/docs/${doc.slug}): ${doc.description}`),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
