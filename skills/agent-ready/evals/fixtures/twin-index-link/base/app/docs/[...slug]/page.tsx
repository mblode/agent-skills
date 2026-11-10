import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getDoc, listDocs } from "@/lib/docs";

type Props = { params: Promise<{ slug: string[] }> };

export async function generateStaticParams() {
  const docs = await listDocs();
  return docs.map((doc) => ({ slug: doc.slug.split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDoc(slug.join("/"));
  return doc ? { title: `${doc.title} | Quill Harbor docs`, description: doc.description } : {};
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const doc = await getDoc(slug.join("/"));
  if (!doc) notFound();

  const docs = await listDocs();

  return (
    <div className="docs-layout">
      <nav aria-label="Documentation">
        <ul>
          {docs.map((entry) => (
            <li key={entry.slug}>
              <a href={`/docs/${entry.slug}`} aria-current={entry.slug === doc.slug ? "page" : undefined}>
                {entry.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <article>
        <h1>{doc.title}</h1>
        <MDXRemote source={doc.body} />
      </article>
    </div>
  );
}
