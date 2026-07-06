# Shipping Practices

Keep shipping lightweight but safe. Load when writing the rollout and rollback section of the brief.

## Default mode (small teams)
- Small changes, frequent merges.
- Rollback plan before you ship.
- PRs optional: use them as broadcast, not permission.

## Rollouts
- Feature flags or staged rollout when it matters.
- You might not need a staging environment.
- Prefer instant rollback over perfect pre-merge hygiene.

## Rollback as a first-class path
- Pin every deploy to a commit SHA (build arg or tag) so "what is running" is always answerable.
- Ship a one-click rollback workflow: inputs are the target SHA, the environment, and a mandatory free-text reason; it validates the SHA exists before deploying and emits a summary of what moved.
- End the workflow with a post-rollback checklist: watch error rates filtered by the deployed version, then investigate the root cause; a rollback without a follow-up just reschedules the incident.

## Team shape
- One person owns a feature end-to-end.
- Fewer meetings, longer focus blocks.
- Define "done" before starting.

## Feedback loops
- Session replay, analytics, logs and metrics, alerts to a shared channel.
