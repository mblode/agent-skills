# On-call policy: Matt Blode personal products

Standing triage for Done Bear, blode.co, blode.md, agent-skills, Stratasync, and Matt's OSS. Never Linktree (no Linktree Linear, Slack, or paging). Routines fetch this file remotely.

## Contents

- Fetch
- Roles
- Wake Matt now
- Defer to morning / Autofix
- Draft PR vs intent.md
- Investigation
- Verification and lessons
- Products and signals
- Paging log

## Fetch

Prefer installed files when this skill is on disk. Otherwise:

```bash
gh api repos/mblode/agent-skills/contents/skills/done-bear-oncall/references/oncall.md --jq .content | base64 -d
gh api repos/mblode/agent-skills/contents/skills/done-bear-oncall/references/lessons.md --jq .content | base64 -d
```

Equivalent: `https://raw.githubusercontent.com/mblode/agent-skills/main/skills/done-bear-oncall/references/{oncall,lessons}.md`.

Search lessons by #tag. Newest first. Do not ingest the whole journal.

## Roles

| Role | May | Must not |
|------|-----|----------|
| QA / Autofix / this skill | Triage, draft one PR, write `intent.md`, append lessons | Merge, close incidents, page Linktree |
| Software Engineer / CTO | Merge, deploy, revert | Skip `/ready` after a prod fix |
| CoS `07a643e4-c81c-47d4-9115-f81d5e3d6fc0` | Support intake on the wake path | Own the merge |

## Wake Matt now

Tell the user in-session **and** ping CoS `07a643e4-c81c-47d4-9115-f81d5e3d6fc0` when any of these hold:

| Signal | Wake when |
|--------|-----------|
| UptimeRobot | Critical / prod down |
| `/ready` | Failing (DB or dependency proof) |
| PostHog exceptions | Band ≥20/hour on a product in scope |
| MCP write | `Authentication required` class **after** donebear#408 |
| Data / auth | Data-loss or auth outage |
| Regression | Confirmed customer-blocking regression |

Claude is not the detector. Deterministic monitors (UptimeRobot, `/ready`, exception band) page; this skill proposes severity for findings those monitors missed.

`/health` is process-only. A green `/health` never clears a `/ready` fail and never blocks a wake.

## Defer to morning / Autofix

One sitrep line. No CoS ping. Autofix may open a draft; it still must not merge.

- Single-user noise
- `Script error`, extension frames, Turnstile, `ResizeObserver`
- Known-fixed (a lessons.md entry with a merged PR, symptom gone on `/ready` + smoke)
- Soft one-offs with no stack and no replay
- CI flake whose retry is green

If a deferred class starts matching a wake row (band ≥20/hour, `/ready` red, customer-blocking), promote it. Do not keep deferring by habit.

## Draft PR vs intent.md

| Situation | Output |
|-----------|--------|
| One-seam proven bug, evidence in one repo | **One draft PR.** Never merge. |
| Multi-service, policy, or unclear owner | **`intent.md` to PM/CTO.** No speculative PR. |
| Known-fixed or cannot reproduce | Sitrep only. No PR. |

Draft means `isDraft: true` (or the host's draft equivalent). QA, Autofix, and this skill stop at the draft. Merge is Software Engineer / CTO.

## Investigation

1. Product in scope? If Linktree, stop.
2. Wake table vs defer list.
3. Search lessons.md for the #tag.
4. Timeline: deploy, flag, config, merge in the onset window.
5. Blast radius: who is blocked, which clients (web, desktop, MCP, iOS).
6. Proposed fix: one seam, or `intent.md`.

Diagnosis: what's happening, root cause with links, wake or defer, proposed fix, ruled out.

## Verification and lessons

After a human merge or deploy:

1. Re-check `/ready` on the affected service.
2. Re-run the original failing path (MCP write, the monitor keyword, the exception). A proxy that cannot see the symptom is a partial verify; say so.
3. Append lessons.md, newest first: date, symptom, root cause, fix/PR, gotcha.
4. If the playbook missed a branch, PR an amendment here. Recurring mechanism (3×) graduates into this file; leave a pointer in lessons.md.

Would a monitor have caught this earlier? If detection was human or late, propose a paste-ready UptimeRobot keyword or PostHog trend, with this incident as provenance. Humans install monitors.

## Products and signals

| Product | Typical signals |
|---------|-----------------|
| Done Bear (`donebear/donebear`) | Fly manage-api `/ready`, PostHog exceptions, hosted MCP, desktop OAuth |
| blode.co, blode.md | Uptime, Vercel |
| agent-skills (`mblode/agent-skills`) | CI, this playbook |
| Stratasync | iOS / local-first sync (Done Bear package) |
| OSS | CI on Matt's public repos |
| Linktree | Out of scope |

Weather digest: `/ready`, UptimeRobot, exception rate, open drafts. Post only when something changed or a wake row trips. Silence is valid.

## Paging log

Every wake/no-wake decision is one line: signal, threshold, pinged or deferred, link. A deferred item that later wakes is a new decision, not a silent upgrade.
