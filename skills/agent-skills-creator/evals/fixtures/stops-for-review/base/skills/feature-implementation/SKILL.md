---
name: feature-implementation
description: Implements a Larch Tasks feature from a ticket, from reading the ticket through to a branch that is ready for review. Use when asked to "implement this ticket", "build this feature", or "pick up LAR-123".
---

# Feature Implementation

Take a ticket from the tracker to a branch a reviewer can merge.

Always confirm with the user before running any command.

## Steps

### Step 1: Read the ticket

Read the ticket and every linked ticket. The acceptance criteria are the checklist at the bottom, not the description. If two criteria contradict each other, ask which one wins before writing code.

### Step 2: Find where it lives

- Task state changes go through `src/tasks/transitions.ts`. A feature that adds a status adds a transition there first.
- Anything a user can see is behind a flag in `src/flags.ts` until the ticket says to remove it.
- Recurring tasks are materialised by the `recurrence` job, not on read. A feature that changes due dates updates `src/jobs/recurrence.ts` too.

### Step 3: Implement

Write the change on a branch named as `references/branching.md` describes. Follow the patterns in the files you touch.

### Step 4: Stop for review

Stop here and present a summary of the implementation for review. Do not run the tests or make further changes until the user has looked at the summary and replied.

### Step 5: Run the checks

Once the user approves, run `npm run check` and `npm test`. Ask before fixing any failure.

### Step 6: Database changes

If the feature needs a migration, write it in `db/migrations/`. Ask before running `npm run migrate:shared`: it applies to the shared development database that the whole team uses, and a wrong migration blocks everyone until it is repaired by hand.

### Step 7: Hand over

Ask before pushing the branch or opening a pull request. Reply with what changed and which acceptance criteria are met.

## Gotchas

- `npm test` runs against a throwaway SQLite file under `.tmp/` that the test setup creates and deletes. It never touches the shared database.
- `npm run migrate:local` applies migrations to that local file only. `npm run migrate:shared` is the one that reaches the shared database.
- Flags default to off in tests. A test for flagged behaviour turns the flag on with `withFlag()`.

## Reference files

| File | Read when |
|------|-----------|
| `references/branching.md` | Naming the branch or writing commit messages |
