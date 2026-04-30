---
title: Miller's Law
impact: CRITICAL
tier: programmatic
prefix: cognitive
tags: working-memory, chunks, magical-number-seven, grouping
related: cognitive-chunking, cognitive-working-memory, decision-hicks-law
---

## Miller's Law

The average person can hold roughly 7 ± 2 chunks of information in working memory at once (Miller, 1956). Apply it to anything the user must mentally hold while doing something else: a one-time code while switching apps, a list of options while comparing, a path of breadcrumbs while drilling down.

Important: 7 ± 2 is not a UI element-count rule. A well-grouped 30-item menu is easier than an ungrouped 7-item one because the user holds the group, not the items. The threshold below applies to *ungrouped* siblings — items not wrapped in `<fieldset>`, `role="group"`, a `<section>` with a heading, or a visually-distinct subgroup.

## Check

**Surfaces:** primary-nav, dashboard

**Procedure:**
1. Identify each grouping container: `<nav>`, dropdown menu, `<ul>`/`<ol>`, card grid, dashboard widget body, list of filters, list of links.
2. For each container, count its direct interactive children (`<a>`, `<button>`, `<li>`, data points in a single widget).
3. Subtract items inside `<fieldset>`, `role="group"`, nested `<section>` with a heading, or visually-distinct subgroups (a divider, a column break, a labelled card).
4. Record the largest remaining ungrouped count per container; compare against the threshold.

**Concrete commands:**
```bash
rg -A 50 '<nav' src/Header.tsx | rg -c '<(a |Link|button)'
rg '<(fieldset|section|div role="group")' src/Header.tsx
```

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | every ungrouped group has ≤7 items | — |
| warn | 8-9 items in any ungrouped group | MEDIUM |
| fail | ≥10 items in any ungrouped group | HIGH |

## Fix

**If fail:** Wrap related items in `<section>` with `<h3>` (or `<fieldset>` + `<legend>` for forms). Split into 3-5 chunks of ≤7 each, named by user intent (e.g. "Mail", "Insights", "Account"). For data widgets, demote secondary metrics to a "More" expansion.

**If warn:** Add one grouping mechanism — a divider, a sub-heading, or a column break — that pulls the count back to ≤7 per visible chunk.

## Examples

**Anti-pattern (verification code crosses working-memory threshold):**

```html
<p>Your verification code is <strong>9472830561</strong></p>
<p>Enter it in the app within 60 seconds.</p>
```

**Applied (chunked, well within ~4 chunks of recall):**

```html
<p>Your verification code is</p>
<p class="code">947 283 0561</p>
<p>Enter it in the app within 60 seconds.</p>
```

**Anti-pattern (flat 14-item menu):**

```html
<nav>
  <a>Inbox</a><a>Sent</a><a>Drafts</a><a>Spam</a><a>Trash</a>
  <a>Reports</a><a>Analytics</a><a>Exports</a><a>Audit log</a>
  <a>Billing</a><a>Plans</a><a>Invoices</a><a>Team</a><a>API keys</a>
</nav>
```

**Applied (3 groups, ~5 items each):**

```html
<nav>
  <section><h3>Mail</h3><a>Inbox</a><a>Sent</a><a>Drafts</a><a>Spam</a><a>Trash</a></section>
  <section><h3>Insights</h3><a>Reports</a><a>Analytics</a><a>Exports</a><a>Audit log</a></section>
  <section><h3>Account</h3><a>Billing</a><a>Plans</a><a>Invoices</a><a>Team</a><a>API keys</a></section>
</nav>
```

Reference: https://lawsofux.com/millers-law/
