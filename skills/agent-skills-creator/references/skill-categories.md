# Skill Categories

Nine categories for the problem a skill solves, orthogonal to the four structural patterns (Simple/hub, Workflow, Rules-based, Mixed) for how it's organized. A skill has one category and one pattern.

## Contents

- How categories and patterns relate
- Library & API Reference
- Product Verification
- Data Fetching & Analysis
- Business Process & Team Automation
- Code Scaffolding & Templates
- Code Quality & Review
- CI/CD & Deployment
- Runbooks
- Infrastructure Operations

## How Categories and Patterns Relate

| Category | Typical pattern | Why |
|----------|----------------|-----|
| Library & API Reference | Simple/hub or Workflow | Dispatch by library/API, or step-by-step integration |
| Product Verification | Workflow | Sequential test steps with assertions |
| Data Fetching & Analysis | Workflow or Mixed | Multi-step queries, platform-conditional references |
| Business Process & Team Automation | Workflow | Sequential steps composing tools and MCPs |
| Code Scaffolding & Templates | Workflow | Phase-by-phase project setup |
| Code Quality & Review | Rules-based or Workflow | Categorized audit rules, or review workflow |
| CI/CD & Deployment | Workflow | Sequential build/deploy/verify steps |
| Runbooks | Workflow or Mixed | Symptom-driven investigation with branches |
| Infrastructure Operations | Workflow | Maintenance procedures with guardrails |

Recommendations, not requirements: a Runbook could be Rules-based with categorized diagnostic checks.

## 1. Library & API Reference

**Definition:** correct use of a library, CLI, or SDK, including internal ones and common libraries Claude gets wrong.

**Authoring tips:**
- Reference code snippets showing correct usage
- Focus on gotchas, edge cases, footguns, not basic usage Claude knows
- Document version differences when migration is common
- Error messages and their solutions

**Examples:** internal billing library edge cases, internal CLI wrapper with every subcommand, design system component patterns

## 2. Product Verification

**Definition:** test or verify code works, often paired with Playwright, tmux, or headless browsers.

**Authoring tips:**
- Scripts that drive the verification (Playwright, tmux commands)
- Record evidence (screenshots, video, logs)
- Enforce programmatic state assertions at each step, not just visual checks
- Define pass/fail criteria

**Examples:** signup flow driver with state assertions, checkout verifier with Stripe test cards, interactive CLI testing via tmux

## 3. Data Fetching & Analysis

**Definition:** connect to data and monitoring stacks: fetch libraries, dashboard IDs, credentials patterns, analysis workflows.

**Authoring tips:**
- Helper functions/scripts for common fetches (see "Store Scripts" in authoring-tips.md)
- Document specific table names, column semantics, join patterns
- Dashboard IDs and query templates
- Let Claude compose scripts from your helper library

**Examples:** funnel query with canonical user_id tables, cohort comparison with significance testing, Grafana datasource UID lookup

## 4. Business Process & Team Automation

**Definition:** automate repetitive workflows into one command; often simple instructions depending on other skills or MCPs.

**Authoring tips:**
- Save run history in log files at `${CLAUDE_PLUGIN_DATA}` for cross-run consistency
- Compose with other skills by name
- Stay on orchestration, don't reimplement what tools already do

**Examples:** standup post aggregation, ticket creation with schema enforcement, weekly recap from PRs and tickets

## 5. Code Scaffolding & Templates

**Definition:** generate framework boilerplate for a specific function in your codebase, with composable scripts.

**Authoring tips:**
- Template files for Claude to copy and adapt; store reusable scripts alongside
- Best when scaffolding has natural-language requirements (naming, architecture) pure code generators can't cover
- Define validation steps to confirm the scaffold works

**Examples:** new service/workflow/handler scaffold with org annotations, migration file template with gotchas, new internal app with auth/logging/deploy pre-wired

## 6. Code Quality & Review

**Definition:** enforce code quality standards and review code; may include deterministic scripts or tools.

**Authoring tips:**
- Run automatically via hooks or GitHub Actions
- Adversarial review: spawn a fresh-eyes subagent to critique, iterate until findings degrade to nitpicks
- Include rules and the verification method
- Separate style preferences (flexible) from correctness requirements (strict)

**Examples:** adversarial code review, org-specific style enforcement, testing practices and coverage expectations

## 7. CI/CD & Deployment

**Definition:** fetch, push, and deploy code. Often reference other skills for data collection or verification.

**Authoring tips:**
- Rollback procedures as a first-class concern
- Clear gates between stages (build → test → deploy → verify)
- On-demand hooks for safety (block force-push, confirm prod)
- Reference monitoring/alerting skills for post-deploy verification

**Examples:** PR babysitting (retry flaky CI, resolve conflicts, auto-merge), gradual traffic rollout with error-rate comparison, cherry-pick to prod workflow

## 8. Runbooks

**Definition:** take a symptom (alert, error, Slack thread) and walk a multi-tool investigation to a structured report.

**Authoring tips:**
- Structure as symptom → tools → query patterns → findings
- Specific dashboard IDs, log queries, service names for your stack
- Output: structured report with severity, impact, next steps
- Map common symptoms to usual root causes

**Examples:** service-specific debugging playbook, oncall alert investigation, request ID log correlation across systems

## 9. Infrastructure Operations

**Definition:** routine maintenance and operational procedures, especially destructive actions needing guardrails.

**Authoring tips:**
- Confirmation gates before destructive operations
- Soak periods (wait and verify before proceeding)
- On-demand hooks to block dangerous commands (`rm -rf`, `DROP TABLE`, `kubectl delete`)
- Log all actions for audit trails

**Examples:** orphaned resource cleanup with Slack notification and confirmation, dependency approval workflow, cost investigation with specific bucket and query patterns
