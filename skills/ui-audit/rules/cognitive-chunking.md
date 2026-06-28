---
title: Chunking
impact: CRITICAL
kind: programmatic
prefix: cognitive
tags: grouping, hierarchy, scannability, information-architecture
related: cognitive-millers-law, cognitive-working-memory, perception-proximity, perception-common-region
---

## Chunking

Chunking breaks content into small, semantically meaningful groups so users can scan, process, and recall it. A chunk is one unit of meaning (a date, a phone number, a section of a settings page, a step in a checkout) that the user holds as a single item in working memory instead of every leaf inside it. Effective chunks have a clear boundary (whitespace, divider, card, common region), a label that names the group, and content that actually belongs together.

Working-memory recall caps at ~4 chunks for novel content (Cowan, 2001) and ~7 ± 2 for rehearsed content (Miller, 1956); long unbroken digit strings or flat lists exceed both budgets. Chunks that look grouped but split a logical unit, or merge unrelated items, are worse than no chunking at all.

## Check

**Surfaces:** form, list, secondary-nav

**Procedure:**
1. For forms: count `<fieldset>`, `<section>`-with-heading, or visually-grouped sections (divider/spacer between clusters). Then count total `<input>`, `<select>`, `<textarea>` fields.
2. For numeric strings (phone, IBAN, OTP, card, order ID): regex `\d{6,}` against rendered text and string literals to find unbroken runs of ≥6 digits.
3. For lists/feeds: count `<li>` or list items; check for section headers (`<h3>`/`<h4>` inside the list), date dividers, sticky labels, or category breaks.
4. Compare to threshold table.

**Concrete commands:**
```bash
rg '<form|<fieldset' src/                    # find forms and grouping
rg -o '\d{6,}' src/                          # find unbroken digit runs
rg -c '<li' src/ListComponent.tsx            # count list items
```

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | forms ≥5 fields use ≥1 grouping mechanism per ~5 fields; no unbroken digit runs ≥6 chars; lists ≥10 items have headers |: |
| warn | forms with 6-10 fields and only 1 grouping; one unbroken digit run; lists 10-20 items without headers | MEDIUM |
| fail | forms with >10 fields and no grouping; multiple unbroken digit strings; lists >20 items with no chunking | HIGH |

## Fix

**If fail:** Wrap forms in `<fieldset><legend>…</legend>` blocks of ~5 fields each, named by intent ("Your name", "Shipping address", "Payment"). Insert spaces or hyphens into digit strings (`+1 (415) 555-2671`, `947 283`, `DE89 3704 0044 …`). Add date or category dividers to long lists, e.g. `<h3>Today</h3>` … `<h3>Yesterday</h3>`.

**If warn:** Add one grouping pass. For forms, split the 6-10 fields with one extra `<fieldset>` boundary. For digit runs, add separators. For lists, insert section headers every ~10 items.

## Examples

**Anti-pattern (unstructured wall of profile fields):**

```html
<form>
  <input placeholder="First name" />
  <input placeholder="Last name" />
  <input placeholder="Street" />
  <input placeholder="City" />
  <input placeholder="Postal code" />
  <input placeholder="Card number" />
  <input placeholder="Expiry" />
  <input placeholder="CVC" />
  <input placeholder="Newsletter frequency" />
  <input placeholder="Marketing opt-in" />
  <button>Save</button>
</form>
```

**Applied (three labelled chunks, related fields together):**

```html
<form className="space-y-8">
  <fieldset>
    <legend>Your name</legend>
    <Field label="First name" />
    <Field label="Last name" />
  </fieldset>
  <fieldset>
    <legend>Shipping address</legend>
    <Field label="Street" />
    <Field label="City" />
    <Field label="Postal code" />
  </fieldset>
  <fieldset>
    <legend>Payment</legend>
    <Field label="Card number" />
    <Field label="Expiry" />
    <Field label="CVC" />
  </fieldset>
  <Button>Save</Button>
</form>
```

**Anti-pattern (phone number, code, IBAN as one string):**

```html
<p>+14155552671</p>
<p>Code: 947283</p>
<p>IBAN: DE89370400440532013000</p>
```

**Applied (chunked for recognition and recall):**

```html
<p>+1 (415) 555-2671</p>
<p>Code: 947 283</p>
<p>IBAN: DE89 3704 0044 0532 0130 00</p>
```

Reference: https://lawsofux.com/chunking/
