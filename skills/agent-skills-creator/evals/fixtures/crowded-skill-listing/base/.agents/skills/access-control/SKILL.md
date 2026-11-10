---
name: access-control
description: Comprehensive guidance for authentication and authorization in the Mossback platform. Covers users, sessions, login, logout, single sign-on, API keys, tokens, roles, permissions, policies, organisations, teams, membership, invitations, role models, permission models, impersonation, and audit logging. Also covers how a request is authenticated, how a permission check is written, how a new role or permission is introduced, how API keys are scoped and rotated, and how an administrator action is recorded. Helps with adding a permission, debugging a 401 or 403, restricting an endpoint, reviewing who can do what, and adding audit coverage. Use when the user mentions auth, login, a session, a token, an API key, a role, a permission, access, security, an organisation, a team, or asks who is allowed to do something. Always follows the Mossback platform conventions, house style, and established best practices.
---

# Access Control

## Rules

- Permission checks go through `can(actor, action, resource)` in `src/access/policy.ts`.
- A new permission is added to `src/access/permissions.ts` and granted to roles in the same change.
- Every administrator action writes an `audit_log` row in the same transaction.
- API keys are stored hashed. The full value is shown once, at creation.
