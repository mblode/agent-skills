---
name: scaffold
description: Scaffolds new repositories from house templates, a Next.js Turborepo web app, a TypeScript CLI or npm package, or a SaaS monorepo with web, API, and worker, and proves each on a cold clone. Use when asked to "create a Next.js project", "bootstrap a turborepo", "start a new web app", "scaffold a CLI", "start an npm package", or "set up the monorepo". For module structure use architecture; for releases and publishing use ship; for a page in an existing app use design.
compatibility: Requires a shell, Git, Node.js, npm, and package registry access. Remote setup requires GitHub and Vercel authentication.
---

# Scaffold

Generate a new repository from the house templates and prove it works from a cold clone before anyone builds on it.

- **IS:** bootstrapping a brand-new repo in one of three profiles, from placeholders through a passing cold-clone run, plus first-time GitHub and Vercel setup when authorized.
- **IS NOT:** structure, module contracts, tenancy, or the first vertical slice (`architecture`), hooks and CI for an existing repo (`gates`), changesets, publish workflows, and every release including the first npm publish (`ship`), pages or visual direction in an existing app (`design`), or auditing an existing CLI's ergonomics (`dx-audit`).

## Profiles

| Profile | Pick when | Reference | Templates |
|---------|-----------|-----------|-----------|
| **Web** | A Next.js site or app, one deployable to start | [references/web.md](references/web.md) | `templates/web/` |
| **CLI** | A TypeScript CLI, library, or npm package | [references/cli.md](references/cli.md) | `templates/cli/` |
| **SaaS** | Web plus API plus worker, Postgres, queues, tenants | [references/saas-stack.md](references/saas-stack.md), then the web profile for `apps/web` | `templates/saas/`, `templates/web/` |

Read only the chosen profile. Ask for missing inputs only when no sensible default exists (`{{name}}`, `{{repo}}`, and `{{author}}` usually; `{{domain}}` for web).

## Shared contract

- **Versions resolve live.** Install each dependency with npm so it resolves the current release, then keep what the lockfile recorded. Never copy a version number from this skill or a template; the templates carry none. When an installed tool rejects a template flag or API, read its version-matched docs (`--help`, bundled docs such as `node_modules/next/dist/docs/`), adapt the template, and name the correction in the report.
- **Placeholders.** Templates use `{{variable}}`. Before any commit, `grep -rn '{{[a-z_]*}}' --exclude-dir=node_modules --exclude-dir=.git .` returns nothing (the pattern skips GitHub's `${{ secrets.X }}`). A `{{name}}` left in `package.json` fails `npm install`; a `{{domain}}` left in metadata ships broken OG URLs.
- **Templates are files to copy.** `gitignore` becomes `.gitignore`; `*.md.tmpl` becomes the named Markdown file; YAML and JSON keep their names in their target locations.

## Scope of done

Done is a committed local repository where `scripts/cold-clone.sh` passes: a clone of the committed state installs fresh, runs codegen where present, check, tests with the Turborepo cache disabled, and build, then answers on its dev and production URLs where the profile has servers. Report each step with its kind (fresh, build, runtime); a cached green never stands in for a fresh one. Uncommitted files are not in the clone, so a scaffold that only works with them is not done.

Pre-approved, because it all happens inside the new directory and on the local machine: writing files, `npm install`, `git init` and local commits, running the checks, and starting dev and production servers on a free port. Stop only processes you started; a port already in use belongs to someone else.

Ask before anything that creates or publishes outside the machine: creating or pushing a GitHub repository, creating a Vercel project or deploying, attaching a domain. A request that already names that remote step authorizes it. Publishing a package is never part of this skill.

## Gotchas

- Hooks live next to `.git`. A `lefthook.yml` inside a workspace is never read by the git hook, and one without `root:` scoping passes paths the linter cannot resolve.
- Lint and format hooks split by file type. `ultracite fix` and oxlint exit non-zero on an empty lintable set, so a JSON-only, CSS-only, or docs-only commit fails a single combined job, and a release bot's version commit is JSON-only.
- `touch <file> && git add <file>` stages nothing; exercise hooks with `npx lefthook run pre-commit --file <path>` or `--all-files`.
- App dependencies in the root `package.json` break workspace isolation and turbo cache keys; the root holds workspace tooling only.
- `ultracite init --quiet` without an explicit linter flag installs Biome.
- A green run from a warm checkout proved nothing on a cold one more than once: an environment singleton evaluated at import, missing generated code, and queues never created all passed cached runs.

## Related skills

- `architecture`: structure, tenancy, and the first vertical slice once the repo exists.
- `gates`: hooks, CI, and verification tiers as the repo grows.
- `ship`: changesets, publish workflows, OIDC trusted publishing, and every release.
- `design`: UI audit and motion before launch; `seo`: metadata, structured data, and sitemap after deploy.
- `dx-audit`: the CLI's flags, errors, and types once real commands exist.

Maintenance only: `evals/evals.json` holds the behavioural scenarios and routing prompts for anyone changing this skill. It never loads during a user task.
