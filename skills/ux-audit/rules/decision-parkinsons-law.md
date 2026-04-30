---
title: Parkinson's Law
impact: HIGH
tier: programmatic
prefix: decision
tags: time, deadlines, autofill, perceived-effort
related: memory-goal-gradient, memory-zeigarnik, decision-teslers-law
---

## Parkinson's Law

A task expands to fill the time allotted to it (C. Northcote Parkinson, 1955). In product UX, perceived task time stretches to match whatever the interface implies the task should take. If checkout looks like a 5-minute job, users will spend 5 minutes on it — even when 30 seconds would suffice.

Compress perceived effort with three levers: shorten the actual work (autofill, smart defaults, saved values), shorten the visual work (one-screen flows, condensed layouts), and set credible expectations (progress meters, step counts, "1 of 3" labels). Be honest — overstating speed and under-delivering damages trust on the next step.

## Check

**Surfaces:** form, multi-step flow

**Procedure:**
1. Find multi-step or long flows (`<Stepper>`, `step={n}`, route segments like `/checkout/[step]`, ≥2 sequential `<form>` screens, or a `<form>` with ≥6 inputs).
2. Check for a visible time bound or progress indicator (`<Stepper>`, `<ProgressBar>`, `aria-valuenow`, `"Step X of Y"`, "under 30 seconds" hints).
3. Check for autofill / smart-fill on common fields: `autoComplete="cc-number | cc-exp | cc-csc | shipping street-address | one-time-code"`, paste handlers for OTP codes, address autocomplete, saved-value providers (Apple Pay, Pay Link).
4. Count manual steps that could be automated (each `<input>` lacking `autoComplete` on a known-format field is one).

**Concrete commands:**
```bash
rg '<Stepper|<ProgressBar|aria-valuenow|"Step \d+ of' src/
rg 'autoComplete=' src/checkout/ src/signup/ src/onboarding/
rg '<ApplePayButton|<PayPalButton|<ShopPayButton|AddressAutocomplete' src/
```

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | visible progress indicator AND ≥1 smart-fill mechanism | — |
| warn | progress shown but no smart-fill (or vice versa) | MEDIUM |
| fail | no progress AND no smart-fill in flows ≥3 steps | HIGH |

## Fix

**If fail:** Add a `<Stepper current={n} total={N}>` at the top, wire `autoComplete` on every known-format input (`cc-number`, `shipping street-address`, `one-time-code`), and offer ≥1 express-checkout option (Apple Pay, Pay Link, PayPal) above the manual form.

**If warn:** Add the missing half — either a step count / progress bar, or `autoComplete` hints + an address autocomplete component.

## Examples

**Anti-pattern (open-ended form, no time signal, no autofill):**

```html
<form>
  <h1>Checkout</h1>
  <input name="firstName" />
  <input name="lastName" />
  <input name="email" />
  <input name="address1" />
  <input name="address2" />
  <input name="city" />
  <input name="region" />
  <input name="postal" />
  <input name="country" />
  <input name="cardNumber" />
  <input name="expMonth" /> <input name="expYear" /> <input name="cvc" />
  <button>Continue</button>
  <!-- No progress indicator, no autocomplete, no Apple Pay / Pay Link option -->
</form>
```

**Applied (autofill, fast-path, explicit progress):**

```tsx
<Stepper current={2} total={3} label="Step 2 of 3 — Payment" />

<ExpressCheckout>
  <ApplePayButton />
  <PayPalButton />
  <ShopPayButton />
</ExpressCheckout>

<form>
  <input name="email" autoComplete="email" />
  <AddressAutocomplete autoComplete="shipping street-address" />
  <input name="cardNumber" autoComplete="cc-number" inputMode="numeric" />
  <input name="cc-exp" autoComplete="cc-exp" />
  <input name="cc-csc" autoComplete="cc-csc" />
  <button>Pay $42.00</button>
  <p className="hint">Most customers finish this step in under 30 seconds.</p>
</form>
```

Reference: https://lawsofux.com/parkinsons-law/
