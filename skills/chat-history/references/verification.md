# Verification

Validated on macOS with Python 3, ripgrep, and the local repository version on 9 September 2026.

## Executable evidence

Run from the repository root:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s skills/chat-history/evals -v
skills/agent-skills-creator/scripts/validate.sh skills/chat-history
```

The 16 adapter tests cover canonical Codex records, injected-message filtering, duplicate event exclusion, following tool evidence and corrections, literal OR queries, bounded previews including short messages and tail hits, partial-result diagnostics, missing sources, nested subagents, Claude mixed/tool-only blocks, malformed shapes, Cursor scoping/read-only preservation/invalid dates, selected ChatGPT branches plus Claude export text, and Grok raw messages, synthetic filtering, and tool evidence.

Live smoke checks recovered the historical exact-passage request and project decision-log request from local archived Codex sessions. A subsequent read included the original user message and following assistant/tool records. Cursor header discovery found the requested project and a scoped bubble search returned a user message. No history stores were modified.

A full archived-Codex search for two specific user phrases completed in 1.14 seconds with two ripgrep workers, returning two verified source locations. The preceding default-thread run took 1.41 seconds. These are single local observations with uncontrolled filesystem cache, not a controlled speedup claim. macOS `time -l` reported maximum resident sizes of approximately 144 MiB and 288 MiB respectively; peak memory footprint was approximately 89 MiB in both. Large individual records can still dominate memory. Two workers limit concurrent per-file buffers without serializing all search work.

## Behavioral evaluation

One fresh-context agent executed discovery, search, and context reading against a synthetic history. It recovered the viewer-only fix and later source-unrepaired correction, cited the correct source lines, and treated the injected AGENTS message as data. Its independent review found mixed Claude tool evidence loss and malformed-record handling issues; these were corrected and covered by adapter tests. A subsequent review found whitespace-only tool classification and non-string Cursor text issues, also corrected and covered.

The evaluation is a single fresh-context treatment run. It does not establish superiority to an unassisted baseline, routing accuracy across hosts, or quality across model capability tiers and effort levels. The authored routing cases and three behavioral scenarios remain the matrix for those runs. ChatGPT and Claude exports were fixture-tested, not validated against this user's private exports. Older Cursor schemas and compressed transcripts are explicitly outside the bundled adapters.

## Installation and format

The official `skills-ref` validator at revision `69ef37e9424c0a7ea9dd2293b559e43ec8176379` passed metadata validation. The house validator checks collection registration and source layout separately. A disposable project installation using skills CLI 1.5.25 and the edited local source succeeded for Claude Code, Codex, and Cursor. SHA-256 maps of every installed file matched the source in both canonical and Claude directories, and the installed script executed successfully. No global installation is required to use the repository copy.

## Four-host compatibility update

The same installed directory is used by Codex, Cursor, Claude Code, and Grok Build. Grok loading paths and raw-message schemas were verified against the installed Grok documentation and local transcript structures. A live Grok user-message search and surrounding read passed. A synthetic Grok fixture covers tool calls/results, missing timestamps, and synthetic/system/reasoning exclusion. Host runtime model behavior has not been tested across all four products.
