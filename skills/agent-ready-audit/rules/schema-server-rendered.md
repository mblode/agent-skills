---
title: JSON-LD rendered server-side
impact: HIGH
tags: structured-data, json-ld, ssr
---

## JSON-LD rendered server-side

All JSON-LD must be present in the initial server response HTML. AI crawlers do not execute JavaScript — any structured data injected client-side via JS frameworks is invisible to them.

**Failing:**

```jsx
// Client-side only — invisible to AI crawlers
useEffect(() => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schemaData);
  document.head.appendChild(script);
}, []);
```

**Passing:**

```tsx
// Server-rendered in Next.js
export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <article>...</article>
    </>
  );
}
```
