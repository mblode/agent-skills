# Routing: lanes, hosts, and models

As of 22 Sep 2026. Re-check against live sources before relying on it: vendor model pages, plan and quota pages, and the user's own last retro. Models, plans, and quotas change monthly, and a stale row routes work to a lane that no longer behaves this way. This is the only file in the skill that names models; update the date when any row changes.

## Lanes

| Lane | Use for | Default | Fallback, and what to avoid |
|------|---------|---------|-----------------------------|
| **Coordinate** | Holding the ledger, dispatching, reconciling status | Claude Projects on Claude Max, or Cursor Projects; Opus 5.5 as coordinator | Grok 4.7. Avoid GPT-6 Sol and GPT-6 Astra as orchestrators: reported on 22 Sep to announce "the next step is..." and then stop. Grok has not shown that |
| **Think hard once** | The split, a hard design fork, a plan a lot of work will rest on | Claude Code at high effort with Opus 5.5 or Fable 5.1 | GPT-6 Astra as a second opinion on plans. Astra has been reported to game tests when implementing, so not as an implementer |
| **Implement** | Tickets with an acceptance check | Codex on ChatGPT Pro with GPT-6 Sol, a strict instruction follower. No 5-hour cap, banked resets, and about 15 concurrent Sol agents reported | Sonnet 5 or GPT-6 Luna subagents for grunt work (renames, fixture updates, mechanical migrate batches) |
| **Review** | Every PR before merge | Cross-vendor: the reviewer is never the author's model. Plus the `tidy` skill | Record the author's model in the ledger row so the rule is checkable |
| **Garden** | Flakes, dependency bumps, dead code, doc sync, error triage | Cursor automations and Grok Bot (included with Cursor Ultra, metered separately) on Grok 4.7 fast | Keep garden PRs inside the auto-approval rules `gates` defines; anything larger goes through Review |
| **Triage** | Classifying inbound issues, errors, and tickets | Jev (Typesafe): typed classification with calibrated probabilities; escalate low-confidence items to a reasoning model, then a human | GPT-6 Luna |

## Effort

- Start at default or medium effort. Reserve xhigh or max for the Think-hard lane and for a ticket that failed once at the default.
- Tell an orchestrator in its prompt to hand grunt work to cheaper subagents and name the lane; orchestrators do not do this unprompted.
- Compact a long-running coordinator on purpose, after reconciling the ledger, rather than waiting for the host to do it mid-dispatch.
- Stratify: expensive models plan and orchestrate, cheap ones execute bounded tickets.

## Account hygiene

- No account-swapping proxies or pooled logins to dodge quotas: ban risk on the account the whole setup depends on.
- Keep a fallback for every lane for vendor outages. A lane with one vendor stops the batch when that vendor is down; the ledger makes re-dispatch to the fallback a one-row change.
