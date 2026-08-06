# README Quality Checklist

Run before finalizing a README. Score each applicable item: Yes = 1, No = 0, N/A = exclude from denominator. Target: all applicable items pass.

## Audience (5 checks)

1. No section that only helps someone changing the code (no Development, Tech Stack, Architecture, Release, Workspaces, Scripts, Contributing)
2. Install is what a stranger runs, not `git clone` (unless cloning genuinely is the product)
3. The install command uses the published package name from the manifest, not the repo or private root name
4. A first-time reader gets something running, or sees the thing working, within 60 seconds
5. Content moved out landed in `AGENTS.md` or `CONTRIBUTING.md` rather than being deleted

## Structure (7 checks)

6. Title is the display name, linked to the live site if one exists
7. Tagline directly below the title with no heading, and it does not open with the project's own name
8. A plain second line saying what you do with it
9. Section order follows the spine: header, Demo, Install, Quickstart, capability sections, License
10. Two to four capability sections, no more
11. Headings use the canonical names: `Install`, `Quickstart`, `Demo`, `License` (not `Installation`, `Getting Started`, `Quick start`, `Licence`)
12. Headings are sentence case, and nothing goes deeper than `###`

## Content (6 checks)

13. Every code block runs copy-pasted, no modification
14. No placeholder text, TODO markers, or `foo`/`bar`/`my-app`/`your-name-here` values
15. Quickstart produces visible output and is complete rather than elided
16. Install shows one command, not a package-manager matrix
17. Capability bullets use `- **Name:** what it does.` with a colon
18. Images are committed under `.github/assets/`, not hotlinked to an external host

## Writing (6 checks)

19. Active voice ("Install the package" not "The package can be installed")
20. No "This project is..." or "This is a..." openers
21. No em dashes, and table cells meaning "not applicable" are empty rather than a dash
22. Consistent terminology (one term per concept, same casing)
23. No orphaned sections (every heading has content below it)
24. No hedged capability claims ("should work", "aims to", "tries to")

## Badges and footer (4 checks)

25. Badges present only if the project publishes to a registry
26. At most two badges (version, license), in one style and one colour scheme
27. No CI, stars, downloads, runtime-version, or "maintained" badge
28. License section present, with the footer credit line if the house style has one

## Freshness (4 checks)

29. Badge package name matches the published package (or badges are absent)
30. Spot-check 2-3 links are not broken
31. No references to deprecated APIs, removed features, or old package names
32. Total length between 40 and 130 lines

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

## Automatic Fail

Any of these means the README is not ready:

- No description (reader cannot tell what the project does)
- No install or demo (reader can neither use it nor see it)
- Default boilerplate README (e.g., unchanged create-next-app template)
- Code examples that cannot run (syntax errors, missing imports, wrong API)
- A section that only serves contributors
- An install command against a package name that does not exist on the registry
