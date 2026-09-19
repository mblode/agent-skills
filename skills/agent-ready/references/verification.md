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

## Server logs

Client-side analytics cannot see agents. Measure readership and navigation failures from the server or CDN log instead, before and after the change:

```bash
# requests for machine-readable routes
grep -E '(\.md|llms(-full)?\.txt) HTTP' access.log | wc -l
# 404s from recognized AI clients, by path
grep -iE 'claude|gptbot|chatgpt-user|oai-searchbot|perplexitybot|anthropic|codex' access.log \
  | awk '$9 == 404 {print $7}' | sort | uniq -c | sort -rn | head -20
```

Adjust field numbers to the log format. Bursts of 404s where the path is a plausible sibling of a real page (`/docs/auth/api-keys` when only `/docs/authentication` exists) are the navigation failure; a falling count after the twin link ships is the evidence to quote.

## Navigation benchmark

When the user wants the failed-request number itself, run Mintlify's open-source [url-discovery-bench](https://github.com/mintlify/url-discovery-bench) against the site. It needs Python 3.9+, plus Claude Code or the Codex CLI for the agent arms, and spends model tokens, so confirm the spend first.

```bash
git clone https://github.com/mintlify/url-discovery-bench && cd url-discovery-bench
pip install -r requirements.txt
python -m url_discovery_bench.run --dataset dataset/<site>.json --agents claude
python -m url_discovery_bench.report jobs/<jobname>
```

Write `dataset/<site>.json` from the site's real pages and questions in the shape of the bundled datasets. Compare the `md-link` arm against `html` and `md`; the report's published baseline is 2.23, 1.42, and 0.11 failed requests per task. Quote the site's own numbers, not the baseline.

## Tests

Add a test that hits the route or handler: markdown content-type, problem+json status and `code`, OpenAPI fragment for 4xx, `RateLimit` header. Match the project's runner. Do not add a browser screenshot as the only proof of a header.

## Remaining recommendations

Put in the summary, not in code:

- DNS-AID / DNSSEC
- Publishing an npm/Homebrew CLI that does not exist yet
- Ungating docs that legal or billing require a session for
- Commerce protocols
- Changing bot-training policy
