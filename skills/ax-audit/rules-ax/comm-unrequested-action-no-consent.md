---
title: Agent acts unprompted with no standing consent and no notice
slug: comm-unrequested-action-no-consent
category: comm
defaultTier: fix-this-sprint
surfaces: agent-tool-execution, agent-dashboard
ax-pattern: Proactive action needs a different consent shape than requested action
detection: code-auditable
related: control-no-approval-gate, comm-no-approval-gate, trust-no-escalation-path, comm-no-intent-handshake
---

## Agent acts unprompted with no standing consent and no notice

Every gate in the product sits on the path a user starts. The agent also runs on a schedule, a webhook, and a queue, and those paths reach the same executor without passing a gate, because a background job has nobody to prompt. So the agent acts on the user's accounts while the user is asleep, and the record of it is a log row.

An agent worth having does not wait to be asked. That is the point of the layer. But an action nobody requested cannot borrow its permission from a request, so it needs the two things a prompt would have given it: a boundary agreed in advance, and a notice afterwards the user can act on.

## What goes wrong

A weekly cleanup job is scheduled to "tidy stale drafts". The definition of stale changes when the underlying model is updated, and one run archives forty documents a user was still working on. The user finds out on Monday. There was no approval prompt, correctly, because nobody was at the keyboard. There was also no standing rule bounding what the job could touch, and no notification when it touched more than usual, so the first signal was the damage.

## Detection

**Surfaces:** agent-tool-execution, agent-dashboard

**Auditability:** code-auditable

**Static signals:**
1. Find the unprompted entry points: cron and scheduler registrations, queue consumers, webhook handlers, event subscribers, retry workers.
2. Trace each to the tool executor or agent runner. Entry points that never reach it are out of scope.
3. On each path that does reach it, look for a standing consent check: a policy object, an allowlist of tools valid without a user present, a budget or blast-radius limit.
4. Look for a notification emitted on the same path, addressed to the user, carrying what was done.
5. Fail when a path reaches the executor missing either control. The boundary and the notice are not alternatives: a policy with no notice leaves the user unable to find out, and a notice with no policy tells them only after the blast radius was already unbounded. One present and one absent is still a finding, named for the missing half.

**Concrete commands:**
```bash
# unprompted entry points
rg -n -i 'cron|schedule\(|CronJob|@Cron|queue\.(process|consume)|webhook|onEvent|subscribe\(' --type=ts src/ -l

# do they reach the executor?
rg -n -i 'runAgent|executeTool|orchestrator|invokeTools' --type=ts src/ -l

# a boundary on the unattended path
rg -n -i 'autonomousPolicy|allowUnattended|standingConsent|withoutUser|maxActions|budget|dontAsk|allowedTools' --type=ts src/

# a notice the user can act on
rg -n -i 'notify|sendNotification|createActivity|digest' --type=ts src/ -A 2
```

**Judgment signals:**
- A notification that only records success is a partial pass. The user needs to be able to reverse what they read about, so check that the notice links to an undo or a review surface.
- A boundary expressed only as "the prompt tells it not to" is not a boundary. Look for a check in code on the execution path.
- A headless Claude Agent SDK run with `permissionMode: "dontAsk"` and an explicit `allowedTools` list is a standing boundary: anything unlisted is denied rather than prompted. That satisfies the boundary half only; the notice still has to exist.

**False-positive guards:**
- Skip read-only background work: a nightly index or summary that writes nothing the user owns.
- A job whose entire effect is to draft something for later review passes: the draft is the notice, and the review is the gate.
- Skip files with `// ax-audit-ignore:comm-unrequested-action-no-consent` near the match.
- Skip test harnesses, local seed scripts, and CI jobs.
- Do not double-report with `control-no-approval-gate`. That rule governs the path a user started; this one governs the path nobody started. If a single executor serves both and neither is gated, file the approval-gate finding for the interactive path and this one for the unattended path, each with its own entry point in evidence.

## Fix

Give the unattended path its own policy and make it report.

```ts
// before: the same executor, no user, no boundary
cron.schedule("0 3 * * 1", async () => {
  await runAgent({ goal: "tidy stale drafts", userId });
});

// after: a standing boundary agreed in advance, and a notice with a way back
cron.schedule("0 3 * * 1", async () => {
  const policy = await getStandingConsent(userId, "weekly-tidy");
  if (!policy) return;

  const result = await runAgent({
    goal: "tidy stale drafts",
    userId,
    allowedTools: policy.allowedTools,
    maxAffected: policy.maxAffected,
    onLimitExceeded: "pause",
  });

  await notify(userId, {
    title: `Tidied ${result.affected.length} drafts`,
    items: result.affected,
    undo: result.undoToken,
  });
});
```

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

| Surface | Tier |
|---|---|
| Agent tool execution | release-blocker |
| Agent chat | fix-this-sprint |
| Agent config | fix-this-sprint |
| Agent dashboard | fix-this-sprint |

The dashboard row does not taper below `fix-this-sprint` the way monitoring findings usually do. A dashboard is where an unattended run becomes visible at all, so a missing notice is the defect itself rather than a report of one.

## Examples

**Anti-pattern (fails):**

```ts
webhooks.on("invoice.overdue", async ({ customerId }) => {
  await runAgent({ goal: "chase the overdue invoice", customerId });
});
```

An external event causes the agent to email a customer. No policy bounds it, and the user learns about it if the customer replies.

**Applied (passes):**

```ts
webhooks.on("invoice.overdue", async ({ customerId }) => {
  const policy = await getStandingConsent(ownerOf(customerId), "invoice-chase");
  if (!policy?.allowsOutbound) return queueForReview(customerId);

  const result = await runAgent({ goal: "chase the overdue invoice", customerId, policy });
  await notify(ownerOf(customerId), { title: "Chased an overdue invoice", items: result.sent, undo: result.undoToken });
});
```

## Suppression

```ts
// ax-audit-ignore:comm-unrequested-action-no-consent, read-only nightly summary, writes nothing
cron.schedule("0 2 * * *", buildUsageDigest);
```
