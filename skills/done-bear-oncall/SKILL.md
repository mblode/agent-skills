---
name: done-bear-oncall
description: "Deterministic on-call triage and lessons loop for Matt Blode personal products (Done Bear, blode.co, blode.md, agent-skills, Stratasync, OSS). Classifies wake-now vs defer, drafts one-seam PRs, and appends lessons.md. Use when a QA incident, Autofix exception, prod incident webhook, UptimeRobot page, /ready failure, MCP Authentication required, or weather digest needs a sitrep. Not for Linktree. For PR review use pr-reviewer; for CI on an open PR use pr-babysitter."
compatibility: Requires GitHub (`gh`) for remote playbook fetch and draft PRs. Observability (PostHog, UptimeRobot, Fly) as available. A local clone of this skill repo is not required.
---

# Done Bear on-call

- **IS:** first-pass triage for Matt Blode personal products: wake vs defer, a draft PR or an `intent.md`, verification, and a lessons.md append.
- **IS NOT:** Linktree, merging PRs, declaring incidents closed, paging from `/health` alone, or reviewing an already-open PR (`pr-reviewer` / `pr-babysitter`).

Standing policy lives in `references/oncall.md`. Known causes live in `references/lessons.md`. Files over memory. Search lessons by #tag; do not ingest the whole journal.

## Invocation

| Trigger | Mode |
|---------|------|
| QA incident, PostHog exception, "triage this error" | Triage, then wake or defer |
| Autofix / exception autocapture | Defer list first; Autofix may draft, never merge |
| Prod incident webhook, UptimeRobot, `/ready` | Wake table first |
| Weather digest, sitrep, "how is prod" | Read-only weather; page only if wake criteria trip |

## Reference Files

| File | Read when |
|------|-----------|
| `references/oncall.md` | Every invocation: scope, wake/defer, roles, draft vs intent, verification |
| `references/lessons.md` | After classifying the symptom: search the matching #tag before hypothesizing |
| `evals/evals.json` | Only when changing this skill; never during an incident |

Routines and cloud sessions fetch these remotely. Do not clone `mblode/agent-skills` as a prerequisite:

```bash
gh api repos/mblode/agent-skills/contents/skills/done-bear-oncall/references/oncall.md --jq .content | base64 -d
gh api repos/mblode/agent-skills/contents/skills/done-bear-oncall/references/lessons.md --jq .content | base64 -d
```

Public raw URLs (same paths under `https://raw.githubusercontent.com/mblode/agent-skills/main/`) are fine when `gh` is unavailable. If this skill is already installed, read the local files instead.

## Procedure

Copy this checklist:

```text
On-call progress:
- [ ] Fetch oncall.md + search lessons.md by #tag
- [ ] Classify: wake now vs defer / Autofix
- [ ] Investigate with evidence links (timeline, then blast radius)
- [ ] Draft one PR or write intent.md; never merge
- [ ] After a human merge: re-check /ready + smoke; append lessons.md
```

1. **Load policy.** Fetch `oncall.md`. Confirm the product is in scope (never Linktree).
2. **Classify.** Match the wake table and the defer list. Wake: tell the user and ping CoS `07a643e4-c81c-47d4-9115-f81d5e3d6fc0`. Defer: one sitrep line, no page.
3. **Check lessons.** Search `lessons.md` for this class's #tag. A matching entry is the first hypothesis to confirm or kill.
4. **Investigate.** Timeline first (deploy, flag, config, merge), then blast radius, then the proposed fix. Every claim needs a link. `/health` is process-only; `/ready` is DB proof.
5. **Act within role.** QA drafts only. One-seam proven bug: one draft PR (`pr-creator`), never merge. Multi-service or policy: `intent.md` to PM/CTO. CoS owns support intake, not code merge.
6. **Verify and learn.** After a human merge, re-check `/ready` and the original failing path, then append `lessons.md` (newest first) and open a playbook PR if a gap remains.

## Diagnosis shape

> **What's happening:** one sentence.
> **Root cause (high/medium/low):** mechanism, each claim linked.
> **Wake or defer:** which row, and whether CoS was pinged.
> **Proposed fix:** draft PR, `intent.md`, or no change.
> **Ruled out:** alternatives and the evidence that killed them.

## Gotchas

- `/health` 200 with `/ready` failing is an outage. Process liveness is not DB proof.
- A 7-day MCP bearer can still carry a ~1h-stale Supabase JWT. `tools/list` staying green does not prove `tools/call`. After donebear#408, a write-path `Authentication required` is wake-now, not the old overnight JWT class.
- Unique-constraint 500s are domain conflicts (`AGENT_MCP_SERVER_SLUG_TAKEN` / 409 after donebear#412), not server crashes.
- Status-code-only monitors miss soft-404s that still return 200. Keyword monitors catch the body.
- Linux WebKitGTK OAuth success does not validate macOS WKWebView. Desktop OAuth needs the WebKit that ships with the OS under test.
- Cloning this repo to read the playbook is wasted setup. `gh api` or raw GitHub is the routine path.

## Related Skills

- `pr-creator`: opens the draft PR this skill may produce
- `pr-reviewer`: local diff review after a draft exists
- `pr-babysitter`: CI on an already-open PR; not incident triage
- `planning`: multi-service `intent.md` that a later session executes
