# Standards Map

The external standards each rule category leans on, for citing a finding, answering "why is that a rule", or breaking a borderline call. Local evidence still decides whether a finding exists; this file decides what to point at once it does.

## Sources

| Source | What it settles | Prefixes |
|--------|-----------------|----------|
| [Command Line Interface Guidelines](https://clig.dev/) | Help and version, stdout versus stderr, exit codes, `NO_COLOR` and `TERM=dumb`, `--json` and `--plain`, prompts only on a TTY with `--no-input` to disable them, `-n`/`--dry-run` and `-f`/`--force`, confirmation tiers by severity, order-independent flags, corrections on typos, additive-only changes, XDG paths, and the precedence order flags > env > project > user > system | `cli-`, `config-` |
| [Node.js `process` docs](https://nodejs.org/api/process.html) | `process.exit()` can truncate pending asynchronous stdout writes; set `process.exitCode` and let the process drain | `cli-exit-codes` |
| [publint rules](https://publint.dev/rules) | `types` first in each `exports` condition, `default` last, root entrypoint present, files published, `bin` has a shebang, `sideEffects` and `engines.node` recommended, `.d.cts` for CJS conditions | `onboard-` |
| [Are the Types Wrong?](https://arethetypeswrong.github.io/) | Resolution problems TypeScript reports nowhere else: masquerading as CJS or ESM, untyped resolution, missing `export =`, fallback conditions, CJS default-export interop | `onboard-exports-resolve-typed`, `types-` |
| [Google AIP-193: Errors](https://google.aip.dev/193) | Split programmatic fields (`ErrorInfo.reason`, `domain`, `metadata`) from the human message; request-specific details belong in metadata so the message can change; messages help a technical user understand and resolve without knowing the implementation | `err-` |
| [Google AIP-140: Field names](https://google.aip.dev/140) | One term per concept across the surface, adjectives before nouns, no prepositions, plural for repeated fields, units in the name (`timeout_ms`) | `api-naming-consistency`, `types-public-jsdoc` |
| [Stripe API errors](https://docs.stripe.com/api/errors) and [idempotent requests](https://docs.stripe.com/api/idempotent_requests) | The `type`/`code`/`message`/`param`/`doc_url` shape; an idempotency key makes a retried create return the first result instead of a duplicate | `err-stable-error-codes`, `err-suggest-the-fix`, `cli-idempotent-resume` |
| [Agent Surface: CLI design](https://agentsurface.dev/docs/cli-design), [Arcjet: designing a CLI for AI agents](https://blog.arcjet.com/designing-a-cli-for-ai-agents/), [Rok Garbas: AI agents are your new users](https://garbas.si/posts/ai-agents-are-your-new-users-cli/) | Agent-ready means discoverable, invokable non-interactively, parseable structurally, retryable safely, and diagnosable from exit status plus error body; validate inputs locally before a network call; keep JSON fields backward compatible; a confirmation that hangs is a failed command | `cli-structured-io`, `cli-schema-introspection`, `cli-agent-input-hardening`, `cli-safe-mutations`, `cli-delta-polling` |

## Tie-breaks

Judgement calls that recur. Each names the winning side and why.

- **Human default or machine default on stdout?** The TTY decides. Interactive terminal gets prose and color; a pipe gets plain text or, when requested, JSON. Neither side needs a flag to get its default (clig.dev; Arcjet).
- **Suggest a correction, or refuse ambiguity?** Suggest in text and in `details.suggestions`, exit non-zero, never execute the guess. Agent-focused guides that disable "did you mean" are objecting to auto-correction, not to the hint (`cli-suggest-corrections`).
- **Is a missing `--json` a finding?** Only when automation or agent use is promised, requested, or already present in the surface. A one-off developer tool with no scripting story is not defective for lacking it (capability gates in SKILL.md).
- **Dual publish or ESM-only?** ESM-only is the default recommendation; dual publishing is a finding only when it is done wrong (missing `.d.cts`, `types` out of order), never for being absent (publint; attw).
- **Message clarity versus structured fields?** Both, in that order of visibility: the human reads the message, the program reads `code`, `param`, and `details`. A perfect message with no code is still a CRITICAL `err-stable-error-codes` finding when callers branch on failures (AIP-193; Stripe).
- **Is a breaking change a finding?** Only with evidence of the prior contract (git base, release tag, published declaration). Without one, report `api-stable-contract` as not assessed rather than inferring a break from missing `@deprecated` tags.
