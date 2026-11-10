---
name: release-tagging
description: Tags a Thistle Commons release and writes its notes. Use when asked to "tag a release", "cut a release", or "what version should this be".
---

# Release Tagging

## Version rules

- Versions are `MAJOR.MINOR.PATCH`. The library is consumed by the three council portals, which pin `~MINOR`, so a MINOR bump is not picked up automatically and a PATCH bump is.
- A change to a response field in `src/api/v2/` that removes or renames it is MAJOR, even behind a flag. The portals deserialize strictly.
- A new optional response field is MINOR.
- A database migration never ships in a PATCH. The portals deploy patches without a maintenance window.

## Steps

1. Read the commits since the last tag and classify each one with the rules above. The highest class wins.
2. Run `npm run release:tag -- <version>`. It refuses to run off `main` or with a dirty tree.
3. Write the notes: one line per change a portal team would act on, breaking changes first.
4. It is important to be very careful here. Always think carefully about whether the version number is right, and make sure to double-check everything before you continue.
5. Push the tag. Do not create the release in the hosting UI; the publish workflow does it from the tag.

## Gotchas

- `release:tag` reads the last tag from `git describe`, so a tag created on a branch that was never merged makes it compute the wrong base. Check `git tag --merged main` if the proposed range looks too short.
- Remember that good release notes are clear, concise, and helpful to the reader.
