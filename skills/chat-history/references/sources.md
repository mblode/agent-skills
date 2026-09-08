# Source adapters

| Source | Discovery and access | Coverage |
| --- | --- | --- |
| Claude Code | `~/.claude/projects`, `~/.config/claude/projects`; choose the encoded project directory | JSONL user/assistant messages and tool-only records; directory searches exclude nested subagents |
| Codex | `$CODEX_HOME/sessions` and `archived_sessions`, default `~/.codex` | Canonical `response_item` messages and function/custom tool records; duplicate `event_msg` summaries excluded |
| Grok Build | `~/.grok/sessions/<encoded-project>/<session>/chat_history.jsonl` | User/assistant text and tool calls/results; synthetic prompts excluded from default search; timestamps may be absent |
| Cursor | Discovered global `state.vscdb`; run `sessions`, optionally scoped by project, then search individual composer IDs | `composerHeaders` and indexed `cursorDiskKV` bubble ranges, types 1 and 2; no global bubble-table scan |
| ChatGPT export | Explicit extracted `.json` export file | Conversation `mapping`, `current_node`, parent chain; selected branch only |
| Claude export | Explicit extracted `.json` export file | Conversation `chat_messages`, human/assistant text |

## Selecting sources

Discovery reports existence without scanning content. Supply paths explicitly to `search`, including paths on other mounts. Shell quoting preserves spaces. Source directories are not inferred from the invoking agent's brand. A remote agent can only read files actually present in its environment.

For JSONL, search a known project directory where one exists. Codex stores sessions by date, so select a known date directory or search its roots for distinctive project terms, then search/read the resulting sessions. The script does not promise a project filter for Codex when metadata is separated from messages.

Cursor header discovery reads metadata, then filters exact project paths and descendants. Increase `sessions --limit` when its diagnostic reports a cap. Search each selected composer separately so a large unrelated conversation cannot monopolize the query. Bubble retrieval uses the existing key index. Known numeric timestamps sort first; absent or invalid timestamps are marked `order: unknown`. Key order is not evidence of chronology. A missing timestamp or ambiguous sequence calls for corroborating evidence, not an invented order.

Exports require no logged-in browser or cloud API. Extract them before passing their JSON files. These adapters recognize specific shapes, not every historical export version. They do not retrieve attachments, zipped archives, encrypted stores, or deleted/cloud-only conversations. Large exports are loaded in memory; do not promise JSONL streaming performance for them.

## Grok records

The installed Grok documentation identifies `updates.jsonl` as its authoritative restore stream and `chat_history.jsonl` as raw model messages. This adapter searches the latter to preserve complete message text rather than individual streaming chunks. It excludes system/reasoning records and marks `synthetic_reason` prompts. Tool calls and results remain readable evidence. It does not parse `updates.jsonl`, so the two logs do not generate duplicate hits. For a restore-specific discrepancy, inspect the authoritative update stream separately. File line order provides sequence; missing timestamps remain null.

## Reading evidence

Search hits retain `path` plus `line` for JSONL, or `session` plus `key` for databases/exports. Use those locators with `read`. Read windows count decoded messages, not physical lines, and include recognized tool-only records. `truncated: true` means increase `--chars` before relying on omitted content. Raw files remain authoritative if an adapter omits an unfamiliar content block.

For exports, pass `--session` when reading a hit to avoid mixing conversations. Stable IDs are not guaranteed by malformed exports; when absent inspect the explicit source file rather than inventing a locator.

## Unsupported or partial sources

- `.jsonl.zst` and other compressed transcripts are not searched. Decompress a specifically needed file into a temporary location using an available decompressor, leaving the source untouched.
- Missing files and unsupported Cursor schemas are errors, not "no history". Older `ItemTable`-only Cursor layouts need a separately verified adapter; do not guess SQL or export the global database wholesale.
- Malformed matching JSONL records and malformed Cursor records produce diagnostics and are skipped. A read can therefore have partial coverage.
- JSONL literal search operates on serialized text. Unicode escapes and escaped quotes may need simpler candidate terms followed by decoded context inspection.
- No returned records establish only that these terms did not match the selected accessible sources under the applied filters.
