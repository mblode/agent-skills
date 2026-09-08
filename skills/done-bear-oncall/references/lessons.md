# lessons.md: personal-products incident journal

Status: seeded 2026-09-08; watching MCP write-path auth after donebear#408; slug conflicts should be 409 after donebear#412.

Newest first. Search by #tag; do not ingest the whole file. Append after every resolved incident without asking.

## Entry format

```
## YYYY-MM-DD · one-line title · #tag · PR-or-thread
- Symptom: one fresh-reader sentence
- Root cause: mechanism, with evidence
- Fix / PR: what landed
- Gotcha: the reusable rule
```

When a #tag hits 3 entries with the same mechanism, promote it into `oncall.md` by PR and leave a pointer here.

---

## 2026-09-08 · MCP server slug unique constraint returned 500 · #mcp-slug · donebear#412
- Symptom: connecting an MCP server whose slug already existed (double-submit / GitHub already connected) threw Postgres unique constraint agent_mcp_servers_user_workspace_slug_key and landed in PostHog as a 500.
- Root cause: `AgentMcpService.create` inserted without mapping unique violation `23505` to a domain error; reconnect already authorized the existing row.
- Fix / PR: [donebear#412](https://github.com/donebear/donebear/pull/412) maps the conflict to `AGENT_MCP_SERVER_SLUG_TAKEN` (409) on create and rename.
- Gotcha: a unique constraint bubbling as 500 is a client conflict, not an outage. Recreate is the wrong fix; 409 is.

## 2026-09-07 · MCP writes Authentication required overnight · #mcp-oauth · donebear#408
- Symptom: Grok/Cursor `tools/call` failed with Authentication required after ~1h while `tools/list` and `/health` stayed green on a 7-day MCP bearer.
- Root cause: two tokens per grant. The MCP bearer (Redis, 7d) is what `verifyMcpAccessToken` checked. The upstream Supabase JWT (~1h `exp`) was snapshotted at issue time and forwarded on writes. Clients do not call `/token` until the MCP bearer is near expiry.
- Fix / PR: [donebear#408](https://github.com/donebear/donebear/pull/408) refreshes the upstream JWT on the still-valid MCP grant (skew, 401/`UNAUTHORIZED` retry). Do not ask Matt to reauth.
- Gotcha: after #408, this class is wake-now. A green MCP connector is not a live GraphQL user.

## 2026-09 · Soft-404s passed status-only uptime · #soft-404
- Symptom: the site served a 200 error page or empty shell; status-code monitors stayed green while users saw "not found" or a blank app.
- Root cause: HTTP status proved the process, not the body.
- Fix / PR: keyword monitors on a known healthy string (and absence of the error-page phrase). Status-only checks remain a complement, not the page signal.
- Gotcha: keyword monitors beat status-code-only. A 200 is not proof the product rendered.

## 2026-09 · /health green during a DB outage · #health-ready
- Symptom: load balancers and `/health` reported up while clients failed to read or write.
- Root cause: `/health` is process liveness. `/ready` is the DB (and required dependency) proof.
- Fix / PR: page on `/ready`, not `/health`. After a fix, re-check `/ready` plus the original failing path.
- Gotcha: `/ready` is DB proof; `/health` is process-only. Never clear an incident on `/health` 200.

## 2026-09 · Desktop OAuth passed on Linux, failed on macOS · #desktop-oauth
- Symptom: Tauri desktop OAuth looked done on a Linux agent VM, then failed for Matt on macOS.
- Root cause: Linux WebKitGTK is not macOS WKWebView. Cookie, redirect, and custom-URL-scheme behavior diverge.
- Fix / PR: treat Linux WebKit success as non-evidence for macOS. Validate OAuth on the WebKit that ships with the OS under test.
- Gotcha: Linux WebKitGTK ≠ macOS WKWebView. Desktop OAuth needs a macOS check (or an explicit "Linux-only, unverified on macOS" label).
