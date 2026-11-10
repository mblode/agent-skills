# Rollback

Roll back a production release that is misbehaving after promotion.

1. Find the previous release tag: `make previous-release ENV=prod`.
2. Check whether the release you are leaving ran an irreversible migration: `make migrate-plan ENV=prod RELEASE=<previous tag>` prints "blocked" if it did.
3. If it prints "blocked", do not roll back the code. Page the data team and fix forward.
4. Otherwise drain the payments worker: `make drain-payments ENV=prod`, and wait for the queue depth to reach 0.
5. Roll back: `make rollback ENV=prod RELEASE=<previous tag>`.
6. Resume the payments worker: `make resume-payments ENV=prod`.
7. Post in the release thread: what was rolled back, to which tag, and why.

## After a rollback

- The rolled-back tag stays in the registry. Do not delete it; the fix is built on top of it.
- Open an incident note with the `incident-notes` skill within one working day.
