# Feature Map Format

One file per feature, written from the user's point of view, so a human skimming it and an agent driving it read the same reach paths, shortcuts, and gotchas. `doctor`, `verify`, and Maintain mode's source wave all read this format; keeping it in one place is what keeps two maps from drifting apart.

## Contents

- [File layout](#file-layout)
- [Template](#template)
- [Field-by-field](#field-by-field)
- [Worked example](#worked-example)
- [Colocated JSON variant](#colocated-json-variant)
- [Keeping the map honest](#keeping-the-map-honest)

## File layout

`features/<id>.md`, one file per feature, `id` kebab-case and stable once assigned. Renaming an id breaks the same way renaming a database column would: `verify`'s history and every proof record reference features by id, not by title, so a rename severs that history rather than continuing it; treat it as a breaking change. A sibling `features/README.md` indexes every file with a one-line summary. A repo whose features already live in per-module folders can colocate the map instead (below); pick one layout per repo.

## Template

```markdown
# <Feature name>

Owns: <glob(s) this feature's checks own, e.g. `src/features/billing/**`>
Preconditions: <baseline state every path below assumes, e.g. signed in as the seeded admin account>

## Reach

- <How a user gets here: menu path, URL, keyboard shortcut>
- <Every entry point, not just the primary one>

## Paths

### <path-id>: <what the user does>

- Method: cli | browser | computer-use | manual
- Drive: <exact command, or spec name and grep; the cheapest thing that still exercises this the way a user would>
- Selectors: <stable role locators or test ids the check drives; required when Method is browser or computer-use>
- Expect: <an observable end state, not "works">
- Gotchas: <traps specific to this path>

### <path-id>: <next path>

...

## Gotchas

<feature-wide traps that do not belong to one path>
```

## Field-by-field

- **Owns.** The glob(s) whose changes should trigger this feature's checks under `verify --since`. Defaults to the feature's own source directory when the repo has one; cross-cutting infrastructure (auth, a shared API client, a shared DB connection) is owned by the user-facing features that exercise it, not fanned out to every feature that happens to import it.
- **Preconditions.** Stated once per feature, not repeated per path: the signed-in state, the seeded data, the flag that must be on. A path with its own additional precondition states it locally.
- **Reach.** Every way a user gets to this feature, in the user's terms: a menu label and its click path, the URL, a keyboard shortcut, a CLI subcommand. A feature reachable three ways and documented for one is a map that looks complete and is not.
- **Paths.** One entry per user-reachable action inside the feature (create, edit, delete, export, the keyboard-only variant, the CLI equivalent). Each path is independently checkable and independently skippable; do not fold three ways of doing the same thing into one path entry, or a skip on the browser way silently reads as a skip on all three.
- **Method.** `cli` or `api` for anything reachable that way, `browser` for a page a browser must render, `computer-use` reserved for native/desktop/OS paths nothing else reaches, `manual` for a path nothing yet drives (`references/verification-ladder.md` has the full ladder and when to escalate).
- **Drive.** Exact enough that a fresh agent runs it without guessing: a real command, or a real spec file and test name. "Click the button" is not a Drive value.
- **Selectors.** The stable locators an agent driving the screen by hand would use: a role and accessible name or a test id, never a CSS position. `role=button[name="New invoice"]` is a selector; `div:nth-child(3) > button` is not. Required on any path a browser or computer-use check drives, because that is exactly the path an agent may have to drive without the spec when the spec breaks. Shortcuts the path offers go here too, in words (`n opens the composer when the list has focus`).
- **Expect.** An observable end state a check can assert against: "the new row appears in the list without a reload," not "it works." A path with no assertable Expect is not yet checkable, whatever its Method claims.
- **Gotchas.** Traps specific to this path (a keypress that types into a focused textbox instead of triggering the shortcut, a toast that dismisses before a slow screenshot captures it) live under the path; traps that apply to the whole feature live in the feature-level Gotchas section at the bottom.

## Worked example

```markdown
# Create Note

Owns: `src/features/notes/**`
Preconditions: signed in as the seeded default user

## Reach

- Sidebar > Notes > New note button
- Keyboard shortcut `n` from anywhere the note list has focus
- `notes create "<title>"` via the CLI

## Paths

### create-via-button: click New note, type a title, save

- Method: browser
- Drive: spec `e2e/notes.spec.ts`, grep "creates a note from the button"
- Selectors: `role=button[name="New note"]`, `role=textbox[name="Title"]`
- Expect: the new note appears at the top of the list without a reload, and its title matches what was typed
- Gotchas: the save button is disabled until the title field loses focus once; clicking it immediately after typing does nothing and is not a bug

### create-via-shortcut: press `n`, type a title, save

- Method: browser
- Drive: spec `e2e/notes.spec.ts`, grep "creates a note from the shortcut"
- Selectors: `role=list[name="Notes"]`; shortcut `n` when the list has focus
- Expect: same as create-via-button
- Gotchas: pressing `n` while a text field already has focus types the character instead of opening the composer; the shortcut only fires when focus is on the list itself

### create-via-cli: `notes create "<title>"`

- Method: cli
- Drive: `notes create "Verify me"` against the isolated instance's API URL, then assert the response body's id is a UUID and the title matches
- Expect: the CLI exits 0 and the API returns the created note; a subsequent `notes list` includes it

## Gotchas

The note list is virtualized past 50 rows; a check that scrolls to find a note by text needs to scroll the virtualized container, not the page.
```

## Colocated JSON variant

When each feature already has a home folder (an API module, a route group), a `feature.json` beside its code keeps ownership next to what it owns and lets a schema validator parse it. Same fields, machine-shaped:

```json
{
  "id": "notes",
  "title": "Create note",
  "paths": ["src/features/notes/"],
  "preconditions": ["signed in as the seeded default user"],
  "userPaths": [
    { "path": "create via button", "selectors": ["role=button[name=\"New note\"]"], "shortcuts": [] },
    { "path": "create via cli", "selectors": [], "shortcuts": [] }
  ],
  "checks": [
    { "path": "create via button", "method": "browser", "spec": "e2e/notes.spec.ts", "grep": "creates a note from the button" },
    { "path": "create via cli", "method": "cli", "command": "pnpm run test src/notes/cli.test.ts" }
  ],
  "gotchas": []
}
```

`userPaths` is the coverage set and `checks` prove it; a path can have several checks (one per method). An entry in `paths` ending in `/` owns everything under it; anything else owns one file. A `feature.json` always belongs to its own feature. Reject unknown keys (a strict schema), so a misspelled field fails instead of being ignored.

## Keeping the map honest

A map that only humans proofread drifts within a quarter; a map a script walks does not. Run a completeness check in the repo's pre-push or CI check (not only inside `verify`), and fail, each message naming its fix, when:

1. A feature file does not parse, or does not match the schema.
2. A module or route folder that should carry a feature file has none.
3. Two features share an id.
4. An owned path does not exist.
5. A check names a path that is not in the feature's user paths.
6. A check cannot resolve what it runs: a cli command whose script, workspace or file argument is missing (or that does not match the one shape `verify` knows how to run), a spec file that does not exist or sits outside the e2e folder, or a grep that matches no test title in that spec.
7. A path with a browser or computer-use check has no selectors.
8. A source file belongs to no feature.

A Drive value `verify` cannot resolve is a broken promise, not a passing check; it should fail as loudly as a broken import fails a build. Adding a feature is "add one file," never "also register it somewhere else": a registry of feature ids invites the drift the map exists to prevent.
