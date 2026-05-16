# Security Checklist

Three-tier classification for security-relevant changes. Load when the diff touches auth, input handling, external APIs, file uploads, or environment configuration.

## Contents

- Always do
- Ask first
- Never do
- OWASP quick reference

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
