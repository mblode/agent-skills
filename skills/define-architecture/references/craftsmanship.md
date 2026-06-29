# Architecture Convention Entries

Load for team-conventions or testing sections. Make conventions enforceable; leave generic style advice out of the brief.

## Entry format

Each convention needs four fields:

- **Boundary:** the files, modules, package, or entrypoint the rule applies to.
- **Failure mode:** the bug, drift, or operational failure the rule prevents.
- **Enforcement:** the lint rule, type check, test, generator, or review gate that catches violations.
- **Owner:** the package, team, or module that owns exceptions.

If a convention cannot name all four, leave it out of the architecture brief.

## Useful convention shapes

- **Domain language:** one canonical name per business concept; list aliases only for migration. Enforcement: domain glossary plus tests or lint for generated API/schema names.
- **Layer imports:** handlers import services; services import DAOs/clients; DAOs never import handlers or request objects. Enforcement: import-boundary lint.
- **Context initialization:** every RPC, HTTP, job, worker, and CLI entrypoint initializes `RequestContext` before shared services. Enforcement: entrypoint tests or fail-closed bootstrap helper.
- **Auth policy registration:** each route or RPC method declares an auth policy at registration. Enforcement: type-level registry or startup validation.
- **Test data isolation:** integration and E2E tests generate unique tenant/user/resource IDs per run. Enforcement: fixture helper plus tests for hard-coded shared IDs.
- **Monorepo dependency ownership:** each deployable app declares runtime dependencies; root manifests hold workspace tooling only. Enforcement: package-manager constraints or dependency lint.
