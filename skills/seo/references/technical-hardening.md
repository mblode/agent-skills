# Delivery and Access

Load this when response handling interferes with discovery. Security/privacy work unrelated to the SEO defect belongs to the relevant project workflow.

- Check both the public proxy host and origin where permitted. Correct source code can still serve an auth page, WAF challenge or cached error at the public URL.
- Verify robots directives in HTML and HTTP headers, including CDN-added fields. Preview deployments on custom domains need an explicit indexing policy; do not assume the platform adds noindex on every hostname.
- Use 503 plus an appropriate Retry-After for temporary unavailability. A long outage can still affect search visibility; the header does not guarantee retention.
- Distinguish browser-enforced CSP/CORP/CORS restrictions from server-to-server fetches. Verify the failing consumer and actual resource response before weakening headers.
- Check static files, redirects and generated metadata under the deployed basePath. Inspect image MIME type and actual content rather than trusting a 200 response.
- For robots changes, verify group precedence and private-route exclusions. Do not disable the WAF globally to accommodate a crawler; use verified identity and the narrow affected rule.
- Do not write real credentials, verification tokens or private analytics exports into public artifacts. Preserve existing ownership verification and request the required scoped access through the host's supported authentication flow.

Legal consent and retention requirements vary by property and jurisdiction. Do not turn a generic SEO checklist into a blanket legal compliance assertion or change consent settings to improve measured conversions.
