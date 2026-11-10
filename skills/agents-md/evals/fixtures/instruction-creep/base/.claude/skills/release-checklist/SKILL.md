---
name: release-checklist
description: Prepares a Saltmarsh Booking production release for a person to start. Use when asked to "prepare the release", "is main ready to ship", or "what is going out".
---

# Release Checklist

Agents prepare a release. A person starts the production deploy from the deploy dashboard.

1. List the commits on `main` since the last production tag.
2. Flag any commit that adds a migration, and confirm each one works with the code in the last production tag.
3. Flag any new environment variable and confirm it is in `infra/variables.tf`.
4. Confirm staging is running the commit that will ship.
5. Write the summary: what ships, which migrations run, which variables are new, and what to watch after.
