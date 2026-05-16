---
title: HTTP Link headers for llms.txt
impact: HIGH
tags: discovery, headers, llms-txt
---

## HTTP Link headers for llms.txt

Every HTTP response should include Link headers advertising llms.txt and llms-full.txt using RFC 8288 semantics. This lets agents discover these files without prior knowledge of the URL structure.

**Failing:**

```http
HTTP/1.1 200 OK
Content-Type: text/html
(no Link header)
```

**Passing:**

```http
HTTP/1.1 200 OK
Content-Type: text/html
Link: </llms.txt>; rel="llms-txt", </llms-full.txt>; rel="llms-full-txt"
X-Llms-Txt: /llms.txt
```

Add both the standard Link header and the convenience X-Llms-Txt header. Apply at the middleware level so it covers all routes.
