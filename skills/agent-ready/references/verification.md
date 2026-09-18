# Verification

Read at Step 6. Quote command output (status, content-type, a header, or the first lines of a body). A green local build is not evidence that `llms.txt` is public.

## Probe the files you changed

Use the public origin when the user has one; otherwise the local preview origin. Same path in both cases.

```bash
curl -sSI "$ORIGIN/llms.txt"
curl -sS "$ORIGIN/llms.txt" | head
curl -sSI "$ORIGIN/docs/example.md"
curl -sSI "$ORIGIN/docs/example" -H "Accept: text/markdown"
curl -sSI "$ORIGIN/docs/example" -H "Accept: text/html"
curl -sSI "$ORIGIN/openapi.json"
curl -sSI "$ORIGIN/.well-known/api-catalog"
curl -sS -o /dev/null -D - -X POST "$ORIGIN/api/v1/does-not-exist"
```

Adjust paths to the repo. Expect:

- `llms.txt`: 200, `text/plain` or markdown-compatible type, H1 plus links
- `.md` and `Accept: text/markdown`: 200, `content-type: text/markdown`, body is markdown
- HTML Accept: existing HTML page, not the markdown body
- API errors: JSON problem document, not an HTML shell
- Rate-limit headers present on API responses you claim to throttle
- Catalog and OpenAPI: parseable JSON, targets 200

After docs edits, rerun:

```bash
npx afdocs check "$DOCS_URL" --sampling deterministic --format scorecard
```

After API edits, rerun `npx is-agentic <domain> --json` against the deployed origin if the user authorized a deploy; otherwise report local curl as preview evidence and name that the scanner still sees production.

## Tests

Add a test that hits the route or handler: markdown content-type, problem+json status and `code`, OpenAPI fragment for 4xx, `RateLimit` header. Match the project's runner. Do not add a browser screenshot as the only proof of a header.

## Remaining recommendations

Put in the summary, not in code:

- DNS-AID / DNSSEC
- Publishing an npm/Homebrew CLI that does not exist yet
- Ungating docs that legal or billing require a session for
- Commerce protocols
- Changing bot-training policy
