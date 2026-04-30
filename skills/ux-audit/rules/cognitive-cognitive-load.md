---
title: Cognitive Load
impact: CRITICAL
tier: programmatic
prefix: cognitive
tags: mental-effort, scannability, signal-to-noise, density
related: cognitive-millers-law, cognitive-chunking, decision-hicks-law, decision-teslers-law
---

## Cognitive Load

Cognitive load is the total mental effort a user spends to understand and operate a UI. Split it into two budgets: intrinsic load is the unavoidable effort tied to the user's goal (filling the form, comparing the plans). Extraneous load is everything else — decorative noise, unclear copy, redundant controls, gratuitous animation, jargon. Cut extraneous load aggressively; intrinsic load is the work, not the waste.

A surface fails when it crosses the working-memory threshold of ~7 simultaneous decisions (Miller, 1956), shows competing primary actions, or buries the critical action in walls of unbroken copy.

## Check

**Surfaces:** form, dashboard, marketing-hero

**Procedure:**
1. Identify the visible region: above-the-fold for a page, or the full bounding box for a modal/section.
2. Count simultaneous interactive elements + decision points: every `<button>`, `<a>` (excluding repeat link styles in copy), `<input>`, `<select>`, `<textarea>`, role="button", and toggle visible without scrolling.
3. Count distinct content blocks: each `<h1>`-`<h4>`, hero copy, body paragraph cluster, or card with body text.
4. Count primary CTAs: buttons styled as the dominant call-to-action (filled, brand colour, largest in region).
5. Compare counts to the threshold table.

**Concrete commands:**
```bash
rg -c '<(button|a |input|select|textarea)' src/ComponentName.tsx
rg -c 'variant="(primary|default)"|className=".*bg-(primary|brand)' src/ComponentName.tsx
```

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | ≤7 interactive elements AND ≤1 primary CTA AND ≤3 distinct content blocks | — |
| warn | 8-10 interactive elements OR 2 primary CTAs | MEDIUM |
| fail | >10 interactive elements OR ≥3 primary CTAs OR walls of body copy without breaks | HIGH |

## Fix

**If fail:** Defer secondary controls behind tabs, accordions, or progressive disclosure. Demote competing CTAs to `variant="ghost"` or `variant="outline"`. Break body copy into ≤75ch lines with subheadings every 2-3 paragraphs.

**If warn:** Demote one of the competing primaries (`variant="secondary"`); collapse the lowest-priority interactive cluster behind a "Show more" toggle.

## Examples

**Anti-pattern (settings page dumps every option at once):**

```tsx
<form className="space-y-2">
  <h1>Settings</h1>
  <input placeholder="Display name" />
  <input placeholder="Email" />
  <input placeholder="Phone" />
  <input placeholder="Timezone (e.g. America/Los_Angeles)" />
  <input placeholder="Webhook URL" />
  <input placeholder="Slack channel ID" />
  <input placeholder="Retention (days)" />
  <input placeholder="API rate limit" />
  {/* ...18 more fields */}
  <button>Save</button>
  <button>Save and notify team</button>
  <button>Save and apply to all projects</button>
</form>
```

**Applied (group by intent, defer the rest):**

```tsx
<Tabs defaultValue="profile">
  <TabsList>
    <TabsTrigger value="profile">Profile</TabsTrigger>
    <TabsTrigger value="notifications">Notifications</TabsTrigger>
    <TabsTrigger value="advanced">Advanced</TabsTrigger>
  </TabsList>
  <TabsContent value="profile" className="space-y-4">
    <Field label="Display name" />
    <Field label="Email" />
    <Field label="Timezone" help="Used for scheduled reports." />
    <Button>Save changes</Button>
  </TabsContent>
</Tabs>
```

Reference: https://lawsofux.com/cognitive-load/
