# Shipping Practices

Load when writing the rollout and rollback section of the brief.

## Rollback as a first-class path

Prefer instant rollback over perfect pre-merge hygiene: treat PRs as broadcast rather than permission, and buy safety with the reversal path instead of the gate.

- Pin every deploy to a commit SHA (build arg or tag) so "what is running" is always answerable.
- Ship a one-click rollback workflow: inputs are the target SHA, the environment, and a mandatory free-text reason; it validates the SHA exists before deploying and emits a summary of what moved.
- End the workflow with a post-rollback checklist: watch error rates filtered by the deployed version, then investigate the root cause; a rollback without a follow-up just reschedules the incident.

Enforcement: the workflow itself. A deploy path that cannot name its running SHA, or a rollback that runs without a recorded reason, fails the Operability check in the validation loop.
