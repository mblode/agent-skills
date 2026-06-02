# Security Checklist

Three-tier classification for security-relevant changes. Load when the diff touches auth, input handling, external APIs, file uploads, or environment configuration — and always in pr-reviewer's Security audit mode (whole-codebase).

## Contents

- Always do
- Ask first
- Never do
- OWASP quick reference
- Threat-model lens (audit mode)
- Vulnerability-class sweep (audit mode)

## How to use this file

- **Diff review (default):** use Always do / Ask first / Never do / OWASP quick reference to classify the security-relevant lines in the change.
- **Security audit mode (whole-codebase):** additionally run the Threat-model lens and the Vulnerability-class sweep below across the named subsystem or whole repo. Walk by class, confirm each hit against real code, and report only concrete exploit paths.

## Always Do

Apply these to every change that handles user input, authentication, or external data:

- **Parameterize queries** — never interpolate user input into SQL, ORM, or NoSQL queries
- **Validate and sanitize input** — use schema validation (Zod, Yup) at system boundaries; reject unexpected shapes early
- **Encode output** — escape user-supplied content before rendering in HTML, URLs, or shell commands; use framework auto-escaping (React JSX, Next.js Server Components) and avoid `dangerouslySetInnerHTML`
- **Use HTTPS everywhere** — enforce TLS for all external calls; reject plain HTTP in API clients
- **Hash passwords with bcrypt/scrypt/argon2** — never store plaintext, MD5, or SHA-family hashes for passwords
- **Set security headers** — `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`
- **Secure cookies** — `HttpOnly`, `Secure`, `SameSite=Strict` (or `Lax` with justification)
- **Audit dependencies** — run `npm audit` or equivalent; flag known vulnerabilities in the diff's dependency changes

## Ask First

Flag these for explicit human confirmation before merging — the reviewer needs to verify intent and scope:

- **Auth flow changes** — login, logout, session management, token refresh, OAuth callback
- **Sensitive data storage** — PII, payment info, health data, credentials; verify encryption at rest
- **External service integrations** — new API keys, webhook endpoints, third-party SDKs
- **CORS configuration changes** — verify allowed origins are intentional and minimal
- **File upload handling** — validate file type, size limits, storage location; never serve uploads from the app domain without scanning
- **Rate limiting changes** — verify thresholds protect against abuse without blocking legitimate users
- **Permission or role changes** — elevation, new roles, access control modifications
- **Environment variable additions** — confirm no secrets are hardcoded; verify they're in `.env.example` but not committed in `.env`

## Never Do

Automatic `critical` severity if found in the diff:

- **Commit secrets** — API keys, tokens, passwords, private keys in source
- **Log sensitive data** — PII, tokens, passwords, or full request bodies in production logs
- **Client-side-only validation** — always validate server-side; client validation is UX, not security
- **Disable security headers** — removing CSP, HSTS, or X-Frame-Options without documented justification
- **Use `eval()` or `innerHTML` with user data** — use safe alternatives (`JSON.parse`, `textContent`, sanitized HTML)
- **Store auth tokens in `localStorage`** — use `HttpOnly` cookies; `localStorage` is accessible to any XSS
- **Expose stack traces in production** — use generic error messages; log details server-side only
- **Trust client-sent IDs for authorization** — always verify ownership server-side

## OWASP Quick Reference

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

Before sweeping for bugs, frame what you're protecting. Spend a few minutes mapping these so the sweep is targeted, not generic:

- **Assets** — what's worth stealing or breaking here? Credentials, PII, payment data, tenant isolation, admin capability.
- **Entry points** — where does untrusted input enter? HTTP routes, webhooks, file uploads, message queues, CLI args, env, third-party callbacks.
- **Trust boundaries** — where does data cross from less-trusted to more-trusted (client→server, tenant→tenant, user→admin, external API→internal)? Every boundary is a place to check authz and validation.
- **Actors** — anonymous user, authenticated user, other tenant, insider, compromised dependency. For each finding ask "which actor reaches this, and what do they gain?"

A finding only matters if a real actor reaches a real asset through a real entry point. Use this to drop speculative items.

## Vulnerability-class sweep (audit mode)

Walk the codebase one class at a time. For each, search for the pattern, then confirm each hit against the actual code before reporting. Suggested search anchors are starting points, not exhaustive.

| Class | Search anchors | Confirm |
|---|---|---|
| Injection (SQL/NoSQL/OS/LDAP) | string-built queries, template literals in queries, `exec`/`spawn`/`child_process`, `$where` | user input reaches the sink unparameterized |
| Broken access control | route handlers, `findById` without owner check, role checks, IDOR on path/body IDs | authorization is enforced server-side per request, ownership verified |
| Authentication & session | token issue/verify, password hashing, session config, refresh/rotation | strong hashing, expiry, rotation, no fixation, no auth bypass path |
| Secrets & config | `process.env`, hardcoded keys/tokens, committed `.env`, logging of secrets | no secrets in source/logs; secrets sourced from env/secret manager |
| Deserialization & parsing | `JSON.parse` on untrusted data into eval paths, `yaml.load`, `eval`, `Function()`, prototype pollution sinks | untrusted input can't reach code execution or pollute prototypes |
| SSRF & outbound requests | `fetch`/`axios`/`http` with user-controlled URLs, webhook callbacks | destination is validated/allow-listed; no internal-network reach |
| File handling | upload handlers, path joins with user input, `fs` reads/writes from request data | path traversal blocked, type/size validated, stored outside web root |
| XSS & output encoding | `dangerouslySetInnerHTML`, `innerHTML`, unescaped templating, `res.send` of user data | output is escaped/sanitized at render |
| Crypto | custom crypto, `Math.random` for tokens, weak/legacy algorithms, ECB mode | uses vetted primitives, CSPRNG for tokens, modern algorithms |
| Dependencies & supply chain | `package.json`/lockfile, postinstall scripts, unpinned versions | no known-vulnerable or unexpected packages; `npm audit` clean of highs |
| Error handling & info leak | stack traces to client, verbose errors, debug flags | generic client errors; details logged server-side only |
| Rate limiting & DoS | unbounded loops over user input, missing limits on expensive endpoints | abuse-prone endpoints are bounded/limited |

For each confirmed hit, report it through the standard three-tier output with the vulnerability class, location, and exploit path.
