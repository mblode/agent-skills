# Persuasion Frameworks

Apply each framework to the copy under review.

## Table of contents

- [Why/How/What (Simon Sinek)](#whyhowwhat-simon-sinek)
- [PAS (Problem → Agitate → Solution)](#pas-problem--agitate--solution)
- [AIDA (Attention → Interest → Desire → Action)](#aida-attention--interest--desire--action)
- [StoryBrand](#storybrand)
- [BAB (Before → After → Bridge)](#bab-before--after--bridge)
- [Show don't tell](#show-dont-tell)
- [Benefit not feature](#benefit-not-feature)
- [Sentence economy](#sentence-economy)
- [CTA clarity](#cta-clarity)

---

## Why/How/What (Simon Sinek)

Most product copy starts with **What** (the product) or **How** (the mechanism). Start with **Why** (the user's motivation or felt problem).

**Test:** Does the first hero/README sentence explain what the product is, or why someone would want it?

| Layer | Question it answers | Example |
|-------|---------------------|---------|
| Why | Why does this matter to the user? | "Most teams lose hours chasing stale data across tabs." |
| How | How does the product address it? | "StrataSync keeps every client in sync, automatically." |
| What | What is the product? | "A real-time data layer for React apps." |

**Correct order:** Why → How → What.

**Before (wrong order):**
> "StrataSync is a real-time data sync engine for React apps. It uses WebSocket connections to keep your data current. Never deal with stale dashboards again."

**After (Why first):**
> "Stale dashboards kill trust. StrataSync keeps every client in sync automatically. No polling, no refresh buttons."

**Flag as:** `[WHAT-NOT-WHY]`

---

## PAS (Problem → Agitate → Solution)

Name the pain, amplify the cost of ignoring it, then present the solution.

**Best for:** Problem-aware audiences. Long-form landing pages, email, ad copy.

**Template:**
1. **Problem.** The pain the user recognises.
2. **Agitate.** The consequences, made real and urgent.
3. **Solution.** How the product resolves it cleanly.

**Example (developer tool):**
> **Problem:** Your API keys are scattered across .env files, CI configs, and Slack messages.
> **Agitate:** One leaked key can bring down production, and you won't know until a customer calls.
> **Solution:** Vault centralises every secret with per-environment rotation and zero-config CI integration.

**Flag:** No flag. PAS is a structural choice, not an error pattern.

---

## AIDA (Attention → Interest → Desire → Action)

A sequential funnel moving a cold reader from awareness to click. Each stage earns the next.

**Best for:** Cold traffic: ads, cold email, splash pages with no prior context.

**Template:**
1. **Attention.** Interrupt the scroll: a bold claim, question, or specific fact.
2. **Interest.** Why it's relevant to *them* specifically.
3. **Desire.** The outcome they want, via social proof or concrete results.
4. **Action.** One clear CTA matching the desire just created.

**Example (B2B SaaS):**
> **Attention:** "73% of SaaS churn happens before users hit their first 'aha' moment."
> **Interest:** "If your onboarding takes more than one session, you're already losing."
> **Desire:** "Teams using Onramp reduce time-to-value by 40%, measured from signup to first export."
> **Action:** "See your onboarding score free →"

**Flag:** No flag. AIDA is a structural choice. Flag individual components with [WHAT-NOT-WHY], [TELL-NOT-SHOW], or [WEAK-CTA].

---

## StoryBrand

The customer is the hero; the product is the guide. The guide gives the hero a plan and a CTA that leads to success and away from failure.

**Key rule:** Never make the product the hero. A guide who centres themselves loses the customer's trust.

**The 7 parts:**

| Part | Question | One-line example |
|------|----------|-----------------|
| 1. Hero | Who is the customer? | A founder who can't sleep because deployments keep failing |
| 2. Problem | What external/internal/philosophical problem do they face? | External: broken deploys. Internal: feeling incompetent. Philosophical: code should ship, not haunt you. |
| 3. Guide | Who helps them? | The product, positioned as the expert who has solved this before |
| 4. Plan | What are the steps? | Connect repo → set alerts → deploy with confidence |
| 5. CTA | What direct action do you invite? | "Start your first deploy free" |
| 6. Success | What does winning look like? | Ship on Friday without anxiety |
| 7. Failure | What are the stakes if they don't act? | More 3am incidents, more team burnout |

**Before (product as hero):**
> "We built Relayer after years of fighting broken CI pipelines. Our team is obsessed with developer experience."

**After (customer as hero):**
> "You shouldn't have to babysit your pipeline. Relayer watches it for you, so you can ship and move on."

**Flag:** `[WHAT-NOT-WHY]` when the product, not the customer, is centred.

---

## BAB (Before → After → Bridge)

Paint the current painful state, show the desired future state, then explain how the product bridges them.

**Template:**
1. **Before.** The frustration or friction the user recognises right now.
2. **After.** The world as they want it to be.
3. **Bridge.** How the product creates that transition.

**Example (analytics tool):**
> **Before:** You spend two hours every Monday pulling reports from four different tools before you can answer one question.
> **After:** Every metric you care about, live, in one dashboard. Monday starts with decisions, not data wrangling.
> **Bridge:** Metric pairs your existing stack in 15 minutes and surfaces the numbers that actually move revenue.

**When to use over PAS:** BAB is warmer and aspirational; PAS is confrontational. Use BAB when the audience is motivated but stuck, PAS when they're not yet urgent.

---

## Show don't tell

Adjectives claim; specifics prove.

**Test:** Can the adjective be replaced with a specific fact, number, or scenario?

| Tell | Show |
|------|------|
| "Powerful analytics" | "See which pages kill signups before users leave" |
| "Easy to set up" | "Live in 5 minutes, no config files" |
| "Seamless sync" | "Edit on mobile, see it on desktop instantly" |
| "Beautifully designed" | "Built to feel native on every device" |
| "Robust infrastructure" | "99.97% uptime across 3 regions, verified by StatusPage" |

**Banned adjectives** (flag every instance in hero copy; subset, full list in [word-lists.md](word-lists.md)):
- powerful, simple, easy, seamless, beautiful, robust, flexible, scalable, smart, intuitive, modern, next-generation, cutting-edge, best-in-class

**Rule:** If you can't name the outcome, the claim doesn't belong in the hero.

**Flag as:** `[TELL-NOT-SHOW]`

---

## Benefit not feature

Features describe the product; benefits, what changes for the user; outcomes, the life after the change.

**Test:** Does this sentence describe what the product *has* or what the user *gets*?

**Feature → Benefit → Outcome chain:**

| Feature | Benefit | Outcome |
|---------|---------|---------|
| Real-time database sync | Your users always see current data | No more "why is this wrong?" support tickets |
| Role-based access controls | Give each team member exactly the access they need | Audits pass on the first try |
| Offline-first architecture | Works when the internet doesn't | Field teams stop losing work mid-session |
| Automated changelog generation | Ship without writing release notes | Save 30 minutes every release cycle |

**Before (feature):**
> "Automated changelog generation with semantic versioning support."

**After (benefit → outcome):**
> "Ship without writing release notes. Your changelog writes itself."

**Rule:** Lead with the outcome for the user; mention the mechanism only after the benefit is clear. Never lead with "featuring" or "with built-in".

**Flag as:** `[FEATURE-NOT-BENEFIT]`

---

## Sentence economy

Every sentence must earn its space.

**Tests:**
- Remove the sentence: does the meaning change? If not, cut it.
- Does the opener add anything? "In order to", "It is important to note that", "The fact is": cut the opener.
- Over 25 words? Break it at the strongest claim.
- Does it restate the headline? Cut it.

**Dead-weight patterns:**

| Pattern | Why it fails |
|---------|-------------|
| "We believe that..." | Softens the claim; just make the claim |
| "X is a Y that helps you Z" | Just say "X does Z" |
| "Whether you're a [A] or a [B]..." | Avoidable hedge that weakens positioning |
| "Our mission is to..." | Founder voice, not user benefit |
| "Designed to be..." | Replace with a demonstration |
| "Powerful yet simple" | Two dead adjectives for the price of one |
| Ending section by restating headline | The reader already read the headline |

**Before:**
> "We believe that developers deserve better tooling. Whether you're a solo founder or a team of 50, Relay is designed to make deployment simple and powerful."

**After:**
> "Deploy in one command. Roll back in two seconds."

**Flag as:** `[DEAD-WEIGHT]`

---

## CTA clarity

CTAs fail when they describe the action, not the outcome. A CTA answers: what do I get, what am I committing to?

**Formula:** Action verb + what they get + qualifier (optional).

**Test:** If someone reads only the CTA, do they know what they're committing to?

| Weak CTA | Why it fails | Strong CTA |
|----------|-------------|------------|
| "Get started" | Vague; started on what? | "Start syncing free" |
| "Learn more" | Passive, no commitment signal | "See how it works" |
| "Sign up" | Describes the form, not the value | "Create your workspace" |
| "Try it now" | No qualifier, implies risk | "Try it free, no card required" |
| "Submit" | Bureaucratic | "Send my request" |
| "Click here" | Never acceptable | "Download the guide" |

**Rules:**
- Use a verb that names the outcome: Start, Create, See, Download, Get, Book, Claim.
- Add a qualifier when space allows: "free", "in 5 minutes", "no card", "no install".
- Never use two CTAs with the same verb on the same screen.
- Primary CTA is high-commitment (Start, Create, Buy); secondary is low-commitment (See, Watch, Learn).

**Flag as:** `[WEAK-CTA]`
