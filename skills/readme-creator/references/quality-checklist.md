# README Quality Checklist

Use as a consumer-path and house-style rubric. Apply only relevant items; a hosted app with no installable product uses its live URL. If scoring is requested, exclude N/A items and keep editorial scores separate from executed verification.

## Audience (5 checks)

1. No section that only helps someone changing the code (Development, Tech Stack, Architecture, Release, Workspaces, Scripts, Contributing, Project structure)
2. Install is what a stranger runs, not `git clone` (unless cloning genuinely is the product)
3. The install command uses the published package name from the manifest, not the repo or private root name, and the package exists on the registry under that name
4. A first-time reader gets something running, or sees the thing working, within 60 seconds
5. Content moved out landed in `AGENTS.md` or `CONTRIBUTING.md` rather than being deleted

## Structure (7 checks)

6. Title is the display name, linked to the live site if one exists
7. Tagline directly below the title with no heading, and it does not open with the project's own name
8. A plain second line saying what you do with it
9. Applicable sections follow the spine: header, Demo, Install, Quickstart, capability sections, License; omit Install for browser-only consumption
10. Two to four capability sections, or a stated reason for a fifth
11. Headings use the canonical names: `Install`, `Quickstart`, `Demo`, `License`
12. Headings are sentence case, and nothing goes deeper than `###`

## Content (6 checks)

13. Every code block runs copy-pasted, no modification
14. No placeholder text, TODO markers, or `foo`/`bar`/`my-app`/`your-name-here` values
15. Quickstart produces visible output and is complete rather than elided
16. Install shows one command, not a package-manager matrix
17. Capability bullets use `- **Name:** what it does.` with a colon
18. Images are committed under `.github/assets/`, not hotlinked to an external host

## Rendering (4 checks)

19. Markdown inside `<div align="center">` and around `<p align="center">` is separated by blank lines
20. For a published package, every image `src` is an absolute `raw.githubusercontent.com` URL; for a GitHub-only repo, relative paths are fine
21. At most one `> [!NOTE]`-style alert, and none if the package publishes to PyPI
22. A dark/light logo uses `<picture>` with an `<img>` fallback, not `#gh-dark-mode-only` fragments

## Writing (6 checks)

23. Active voice ("Install the package" not "The package can be installed")
24. No "This project is..." or "This is a..." openers
25. No em dashes, and table cells meaning "not applicable" are empty rather than a dash
26. Consistent terminology (one term per concept, same casing)
27. No orphaned sections (every heading has content below it)
28. No hedged capability claims ("should work", "aims to", "tries to")

## Badges and footer (4 checks)

29. Badges present only if the project is listed on a registry (npm, crates.io, PyPI, VS Code Marketplace, skills.sh)
30. Two badges (version or installs, plus license) in one style and one colour scheme, or a third that names a distribution channel
31. No CI, stars, downloads, runtime-version, or "maintained" badge, and no license badge without a `LICENSE` file
32. License section present, with the footer credit line if the house style has one

## Freshness (4 checks)

33. Badge package name matches the published package (or badges are absent)
34. Spot-check 2-3 links are not broken
35. No references to deprecated APIs, removed features, or old package names
36. Length fits the type: most READMEs 40 to 90 lines, a CLI with flag tables up to 120, and anything past about 130 has its overflow linked out rather than inlined

## Project-Type Specific

### CLI tools
- Documented flags match the real `--help` output
- Examples show real commands, and the reader can tell what each produces

### Libraries
- Import paths match the package structure
- API detail beyond a screenful lives in a linked docs site, not inline

### Web apps
- Demo or screenshot is present, and above Quickstart
- Environment variables documented only if readers self-host

### Monorepos
- The README is written for what a stranger installs, not for the repo layout
- No workspaces table as the lede

### Skill bundles
- Install is the one `npx skills add` command, with the compatible agents named
- Every skill row links to its `SKILL.md`, and the count in the header matches the rows

## Automatic Fail

Any of these means the README is not ready:

- No description (reader cannot tell what the project does)
- No install or demo (reader can neither use it nor see it)
- Default boilerplate README (e.g., unchanged create-next-app template)
- Code examples that cannot run (syntax errors, missing imports, wrong API)
- A section that only serves contributors
- An install command against a package name that does not exist on the registry
