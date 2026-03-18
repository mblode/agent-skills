# Skill Categories

Nine categories that describe what type of problem a skill solves. These are orthogonal to the four structural patterns (Simple/hub, Workflow, Rules-based, Mixed) which describe how a skill is organized. A skill has one category and one pattern.

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

Category answers **what type of problem** the skill solves. Pattern answers **how the skill is organized** structurally.

| Category | Typical pattern | Why |
|----------|----------------|-----|
| Library & API Reference | Simple/hub or Workflow | Dispatch by library/API, or step-by-step integration guide |
| Product Verification | Workflow | Sequential test steps with assertions |
| Data Fetching & Analysis | Workflow or Mixed | Multi-step queries, platform-conditional references |
| Business Process & Team Automation | Workflow | Sequential steps composing tools and MCPs |
| Code Scaffolding & Templates | Workflow | Phase-by-phase project setup |
| Code Quality & Review | Rules-based or Workflow | Categorized rules for audits, or review workflow |
| CI/CD & Deployment | Workflow | Sequential build/deploy/verify steps |
| Runbooks | Workflow or Mixed | Symptom-driven investigation with conditional branches |
| Infrastructure Operations | Workflow | Maintenance procedures with guardrails |

These are recommendations, not requirements. A Runbook could use Rules-based if it has categorized diagnostic checks.

## 1. Library & API Reference

**Definition:** Skills that explain how to correctly use a library, CLI, or SDK — including internal libraries and common libraries Claude sometimes gets wrong.

**Key authoring tips:**
- Include a folder of reference code snippets showing correct usage
- Focus on gotchas, edge cases, and footguns — not basic usage Claude already knows
- Document the differences between versions if migration is common
- Include error messages and their solutions

**Example use cases:** internal billing library edge cases, internal CLI wrapper with every subcommand, design system component usage patterns

## 2. Product Verification

**Definition:** Skills that describe how to test or verify code is working, often paired with external tools like Playwright, tmux, or headless browsers.

**Key authoring tips:**
- Include scripts that drive the verification (Playwright scripts, tmux commands)
- Have Claude record evidence (screenshots, video, logs) so you can see what was tested
- Enforce programmatic assertions on state at each step, not just visual checks
- Define clear pass/fail criteria

**Example use cases:** signup flow driver with state assertions, checkout verifier with Stripe test cards, interactive CLI testing via tmux

## 3. Data Fetching & Analysis

**Definition:** Skills that connect to data and monitoring stacks. Include libraries to fetch data, dashboard IDs, credentials patterns, and common analysis workflows.

**Key authoring tips:**
- Include helper functions/scripts for common data fetches (see "Store Scripts" in authoring-tips.md)
- Document specific table names, column semantics, and join patterns
- Include dashboard IDs and query templates
- Let Claude compose scripts on the fly from your helper library

**Example use cases:** funnel query with canonical user_id tables, cohort comparison with significance testing, Grafana datasource UID lookup

## 4. Business Process & Team Automation

**Definition:** Skills that automate repetitive workflows into one command. Often simple instructions but with dependencies on other skills or MCPs.

**Key authoring tips:**
- Save previous results in log files so the model stays consistent across runs
- Use `${CLAUDE_PLUGIN_DATA}` for stable storage of run history
- Compose with other skills by referencing them by name
- Keep the skill focused on orchestration, not reimplementing what tools already do

**Example use cases:** standup post aggregation, ticket creation with schema enforcement, weekly recap from PRs and tickets

## 5. Code Scaffolding & Templates

**Definition:** Skills that generate framework boilerplate for a specific function in your codebase. Combine with scripts that can be composed.

**Key authoring tips:**
- Include template files in the skill folder for Claude to copy and adapt
- Useful when scaffolding has natural language requirements (naming conventions, architectural decisions) that pure code generators cannot cover
- Store reusable scripts alongside templates
- Define clear validation steps to confirm the scaffold works

**Example use cases:** new service/workflow/handler scaffold with org annotations, migration file template with gotchas, new internal app with auth/logging/deploy pre-wired

## 6. Code Quality & Review

**Definition:** Skills that enforce code quality standards and review code. Can include deterministic scripts or tools for maximum robustness.

**Key authoring tips:**
- Consider running these automatically via hooks or in GitHub Actions
- Adversarial review pattern: spawn a fresh-eyes subagent to critique, iterate until findings degrade to nitpicks
- Include both the rules and the verification method
- Separate style preferences (flexible) from correctness requirements (strict)

**Example use cases:** adversarial code review, org-specific code style enforcement, testing practices and coverage expectations

## 7. CI/CD & Deployment

**Definition:** Skills that help fetch, push, and deploy code. Often reference other skills for data collection or verification.

**Key authoring tips:**
- Include rollback procedures as a first-class concern
- Define clear gates between stages (build → test → deploy → verify)
- Use on-demand hooks for safety (block force-push, require confirmation for prod)
- Reference monitoring/alerting skills for post-deploy verification

**Example use cases:** PR babysitting (retry flaky CI, resolve conflicts, auto-merge), gradual traffic rollout with error-rate comparison, cherry-pick to prod workflow

## 8. Runbooks

**Definition:** Skills that take a symptom (alert, error, Slack thread) and walk through a multi-tool investigation to produce a structured report.

**Key authoring tips:**
- Structure as symptom → tools → query patterns → findings
- Include the specific dashboard IDs, log queries, and service names for your stack
- Define the output format (structured report with severity, impact, next steps)
- Map common symptoms to their usual root causes

**Example use cases:** service-specific debugging playbook, oncall alert investigation, request ID log correlation across systems

## 9. Infrastructure Operations

**Definition:** Skills that perform routine maintenance and operational procedures, especially those involving destructive actions that benefit from guardrails.

**Key authoring tips:**
- Build in confirmation gates before destructive operations
- Include soak periods (wait and verify before proceeding)
- Use on-demand hooks to block dangerous commands (`rm -rf`, `DROP TABLE`, `kubectl delete`)
- Log all actions for audit trails

**Example use cases:** orphaned resource cleanup with Slack notification and confirmation, dependency approval workflow, cost investigation with specific bucket and query patterns
