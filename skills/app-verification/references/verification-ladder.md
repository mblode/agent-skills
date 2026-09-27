# Verification Ladder

Pick the cheapest method that still exercises a path the way a user actually reaches it. Skipping straight to the most capable method because it can technically reach everything wastes the speed of the cheaper ones for no gain in what gets proven.

## Contents

- [The ladder](#the-ladder)
- [Mapping a path to a method](#mapping-a-path-to-a-method)
- [Native and desktop as the last resort](#native-and-desktop-as-the-last-resort)
- [When nothing yet reaches it](#when-nothing-yet-reaches-it)

## The ladder

1. **`cli` / `api`.** A direct call: a CLI subcommand, an HTTP request against a documented endpoint, a function call against the app's own public interface. Fastest, cheapest, and the right choice for anything that is not fundamentally a rendering or interaction question.
2. **`browser`.** Playwright, the Chrome DevTools protocol, or an equivalent driver, for a path that only exists once a page has rendered: a form, a modal, a drag interaction, a responsive layout question. Slower than a direct call, still cheap enough to run on every change.
3. **`computer-use`.** A general computer-use tool driving the real OS and a real window. Reserved for paths nothing else can reach (below). Slow, token-heavy, and holds a single screen for its duration, so it never becomes the default method for a path a cheaper one could exercise instead.

A path does not get promoted up the ladder just because the harness has a computer-use tool available; it gets promoted only when the cheaper rungs genuinely cannot reach it.

## Mapping a path to a method

| Path is... | Method |
|---|---|
| Pure logic, an API endpoint, a CLI subcommand | `cli` |
| A web page, a form, a modal, a responsive layout | `browser` |
| An Electron or Chromium-embedded surface where a debug protocol is exposed | `browser` (via CDP) |
| A native OS dialog, file picker, or share sheet | `computer-use` |
| A desktop app's native window, menu bar, or system tray | `computer-use` |
| A mobile simulator or a native mobile app | `computer-use` |
| A browser extension's popup or content-script UI | `computer-use` |
| Printing, or any OS-level output surface | `computer-use` |
| A path nothing currently drives | `manual`, with a named reason |

## Native and desktop as the last resort

Reserve computer use for exactly the paths the table above marks for it: an OAuth popup a browser driver cannot script past, a native file picker, an OS share sheet, printing, a mobile simulator, a desktop app's native window or menu bar, a browser extension's own UI, a paper-upload flow that needs a real fixture image. These are the paths where no debug protocol or accessibility tree is exposed to a cheaper driver, so a general computer-use tool driving the actual screen is the only way to exercise them the way a user would.

Two properties fall out of that, and both belong in how a harness uses it: it holds the one screen it drives, so a maintenance run schedules computer-use checks one at a time rather than in parallel with each other; and it is slow and token-heavy relative to the other two rungs, so a feature file that puts a browser-reachable path under `computer-use` "for thoroughness" is paying that cost for a path that never needed it.

## When nothing yet reaches it

`manual` names a path nothing currently drives, and it always reports as a skip with a reason, never silently. The reason should point at what would make it drivable (a fixture, a debug protocol, a computer-use recipe not yet written), which is what turns `manual` into a standing task rather than a place findings go to be forgotten. A feature file where every path is `manual` is not yet a verified feature; it is a map of one that still needs building.
