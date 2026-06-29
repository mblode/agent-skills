# Security Checklist

Three-tier classification for security-relevant changes. Load when the diff touches auth, input handling, external APIs, file uploads, or environment config, and always in pr-reviewer's Security audit mode (whole-codebase).

## Contents

- Always do
- Ask first
- Never do
- OWASP quick reference
- Threat-model lens (audit mode)
- Vulnerability-class sweep (audit mode)

## How to use this file

- **Diff review (default):** classify the security-relevant lines with Always do / Ask first / Never do / OWASP quick reference.
- **Security audit mode (whole-codebase):** also run the Threat-model lens and Vulnerability-class sweep across the named subsystem or repo. Walk by class, confirm each hit against real code, report only concrete exploit paths.

## Always Do

For every change handling user input, authentication, or external data:

- **Parameterize queries:** never interpolate user input into SQL, ORM, or NoSQL queries
- **Validate and sanitize input:** schema validation (Zod, Yup) at system boundaries; reject unexpected shapes early
- **Encode output:** escape user content before rendering in HTML, URLs, or shell commands; use framework auto-escaping (React JSX, Next.js Server Components); avoid `dangerouslySetInnerHTML`
- **Use HTTPS everywhere:** enforce TLS for external calls; reject plain HTTP in API clients
- **Hash passwords with bcrypt/scrypt/argon2:** never plaintext, MD5, or SHA-family hashes for passwords
- **Set security headers:** `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`
- **Secure cookies:** `HttpOnly`, `Secure`, `SameSite=Strict` (or `Lax` with justification)
- **Audit dependencies:** run `npm audit` or equivalent; flag known vulnerabilities in dependency changes

## Ask First

Flag for human confirmation before merging; verify intent and scope:

- **Auth flow changes:** login, logout, session management, token refresh, OAuth callback
- **Sensitive data storage:** PII, payment info, health data, credentials; verify encryption at rest
- **External service integrations:** new API keys, webhook endpoints, third-party SDKs
- **CORS config changes:** verify allowed origins are intentional and minimal
- **File upload handling:** validate type, size limits, storage location; never serve uploads from the app domain without scanning
- **Rate limiting changes:** verify thresholds curb abuse without blocking legitimate users
- **Permission or role changes:** elevation, new roles, access control modifications
- **Environment variable additions:** no hardcoded secrets; in `.env.example` but not committed in `.env`

## Never Do

Automatic `critical` severity if found in the diff:

- **Commit secrets:** API keys, tokens, passwords, private keys in source
- **Log sensitive data:** PII, tokens, passwords, or full request bodies in production logs
- **Client-side-only validation:** always validate server-side; client validation is UX, not security
- **Disable security headers:** removing CSP, HSTS, or X-Frame-Options without documented justification
- **Use `eval()` or `innerHTML` with user data:** use safe alternatives (`JSON.parse`, `textContent`, sanitized HTML)
- **Store auth tokens in `localStorage`:** use `HttpOnly` cookies; `localStorage` is accessible to any XSS
- **Expose stack traces in production:** generic error messages; log details server-side only
- **Trust client-sent IDs for authorization:** always verify ownership server-side

## OWASP Quick Reference

Diff-mode shortcut: the highest-yield categories to eyeball on a changed line. In audit mode skip this and run the fuller Vulnerability-class sweep below (a superset).

| OWASP Category | What to look for in the diff |
|---|---|
| Injection (SQL, NoSQL, OS) | String concatenation with user input in queries or shell commands |
| Broken Authentication | Weak session config, missing token rotation, insecure password storage |
| Sensitive Data Exposure | Unencrypted PII, verbose error responses, missing TLS |
| Broken Access Control | Missing ownership checks, direct object references without auth |
| Security Misconfiguration | Debug mode in production, default credentials, permissive CORS |
| XSS | Unescaped user content in HTML, `dangerouslySetInnerHTML`, `innerHTML` |
| Insecure Dependencies | Known CVEs in `package-lock.json` changes |

## Threat-model lens (audit mode)

Frame what you're protecting before sweeping, so the sweep is targeted, not generic:

- **Assets:** what's worth stealing or breaking? Credentials, PII, payment data, tenant isolation, admin capability.
- **Entry points:** where untrusted input enters: HTTP routes, webhooks, file uploads, message queues, CLI args, env, third-party callbacks.
- **Trust boundaries:** where does data cross from less-trusted to more-trusted (client to server, tenant to tenant, user to admin, external API to internal)? Check authz and validation at each.
- **Actors:** anonymous, authenticated, other tenant, insider, compromised dependency. Per finding ask "which actor reaches this, and what do they gain?"

A finding matters only if a real actor reaches a real asset through a real entry point. Drop speculative items.

## Vulnerability-class sweep (audit mode)

Walk the codebase one class at a time: search for the pattern, then confirm each hit against the actual code before reporting. Search anchors are starting points, not exhaustive.

| Class | Search anchors | Confirm |
|---|---|---|
| Injection (SQL/NoSQL/OS/LDAP) | string-built queries, template literals in queries, `exec`/`spawn`/`child_process`, `$where` | user input reaches the sink unparameterized |
| Broken access control | route handlers, `findById` without owner check, role checks, IDOR on path/body IDs | authorization enforced server-side per request, ownership verified |
| Authentication & session | token issue/verify, password hashing, session config, refresh/rotation | strong hashing, expiry, rotation, no fixation, no auth bypass path |
| Secrets & config | `process.env`, hardcoded keys/tokens, committed `.env`, logging of secrets | no secrets in source/logs; secrets sourced from env/secret manager |
| Deserialization & parsing | `JSON.parse` on untrusted data into eval paths, `yaml.load`, `eval`, `Function()`, prototype pollution sinks | untrusted input can't reach code execution or pollute prototypes |
| SSRF & outbound requests | `fetch`/`axios`/`http` with user-controlled URLs, webhook callbacks | destination validated/allow-listed; no internal-network reach |
| File handling | upload handlers, path joins with user input, `fs` reads/writes from request data | path traversal blocked, type/size validated, stored outside web root |
| XSS & output encoding | `dangerouslySetInnerHTML`, `innerHTML`, unescaped templating, `res.send` of user data | output escaped/sanitized at render |
| Crypto | custom crypto, `Math.random` for tokens, weak/legacy algorithms, ECB mode | vetted primitives, CSPRNG for tokens, modern algorithms |
| Dependencies & supply chain | `package.json`/lockfile, postinstall scripts, unpinned versions | no known-vulnerable or unexpected packages; `npm audit` clean of highs |
| Error handling & info leak | stack traces to client, verbose errors, debug flags | generic client errors; details logged server-side only |
| Rate limiting & DoS | unbounded loops over user input, missing limits on expensive endpoints | abuse-prone endpoints bounded/limited |

For each confirmed hit, report through the standard three-tier output with the vulnerability class, location, and exploit path.
