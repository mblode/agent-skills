#!/usr/bin/env python3
"""Read-only history primitives. Standard library plus ripgrep; see --help."""
import argparse
import collections
import json
import math
import os
from pathlib import Path
import shutil
import sqlite3
import subprocess
import sys


class HistoryError(Exception):
    pass


def emit(value, stream=sys.stdout):
    print(json.dumps(value, ensure_ascii=False), file=stream, flush=True)


def notice(message, **fields):
    emit({'diagnostic': message, **fields}, sys.stderr)


def text_of(content):
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        return '\n'.join(c if isinstance(c, str) else c.get('text', '')
                         for c in content if isinstance(c, (str, dict)))
    if isinstance(content, dict):
        return text_of(content.get('parts', content.get('text', '')))
    return ''


def decode(raw, path, line):
    """One canonical message per JSONL record; tool output is evidence on read."""
    if not isinstance(raw, dict):
        return None
    source = 'claude'
    p = raw
    if Path(path).name == 'chat_history.jsonl':
        source = 'grok'
        kind = raw.get('type')
        if kind not in ('user', 'assistant', 'tool_result'):
            return None
        role = 'tool' if kind == 'tool_result' else kind
        body = text_of(raw.get('content'))
        if raw.get('tool_calls'):
            if not body.strip():
                role = 'tool_call'
            body += '\n' + json.dumps(raw['tool_calls'], ensure_ascii=False)
    elif raw.get('type') == 'response_item':
        source, p = 'codex', raw.get('payload', {})
        if not isinstance(p, dict):
            return None
        kind = p.get('type')
        if kind in ('function_call', 'custom_tool_call'):
            role, body = 'tool_call', p.get('arguments', p.get('input', ''))
        elif kind in ('function_call_output', 'custom_tool_call_output'):
            role, body = 'tool', p.get('output', '')
        elif kind == 'message':
            role, body = p.get('role'), text_of(p.get('content'))
        else:
            return None
    elif isinstance(raw.get('message'), dict):
        p = raw['message']
        role = p.get('role', raw.get('type'))
        blocks = p.get('content', [])
        body = text_of(blocks)
        if isinstance(blocks, list):
            tool_blocks = [b for b in blocks if isinstance(b, dict)
                           and b.get('type') in ('tool_use', 'tool_result')]
            if tool_blocks:
                if not body.strip():
                    role = 'tool' if tool_blocks[0]['type'] == 'tool_result' else 'tool_call'
                body = body + '\n' + json.dumps(tool_blocks, ensure_ascii=False)
    else:
        return None
    if role not in ('user', 'assistant', 'tool', 'tool_call') or not body:
        return None
    if not isinstance(body, str):
        body = json.dumps(body, ensure_ascii=False)
    injected = body.lstrip().startswith((
        '<environment_context>', '<recommended_plugins>', '# AGENTS.md instructions',
        '<task-notification>', '<teammate-message', 'Another Claude session sent',
        'Analyze this Claude Code session and extract structured facets.'))
    return dict(source=source, path=str(path), line=line, role=role, text=body,
                timestamp=raw.get('timestamp'),
                synthetic=bool(injected or raw.get('isCompactSummary') or raw.get('isMeta') or raw.get('synthetic_reason')))


def jsonl(path):
    bad = 0
    with path.open(encoding='utf-8', errors='replace') as f:
        for line, raw in enumerate(f, 1):
            try:
                value = json.loads(raw)
            except ValueError:
                bad += 1
                continue
            record = decode(value, path, line)
            if record:
                yield record
    if bad:
        notice('malformed JSONL records skipped', path=str(path), count=bad)


def cursor(path, session):
    if not session:
        raise HistoryError('Cursor requires --session COMPOSER_ID; use sessions to discover IDs')
    with sqlite3.connect(path.as_uri() + '?mode=ro', uri=True, timeout=1) as db:
        db.execute('PRAGMA query_only=ON')
        # Prefix range uses the existing key index, without loading the global DB.
        prefix = 'bubbleId:' + session + ':'
        rows = db.execute('SELECT key,value FROM cursorDiskKV WHERE key>=? AND key<?',
                          (prefix, 'bubbleId:' + session + ';'))
        records = []
        for key, value in rows:
            try:
                b = json.loads(value)
            except (ValueError, TypeError):
                notice('malformed Cursor bubble skipped', key=key)
                continue
            if not isinstance(b, dict) or b.get('type') not in (1, 2) or not b.get('text'):
                continue
            if not isinstance(b['text'], str):
                notice('non-text Cursor bubble skipped', key=key)
                continue
            records.append(dict(source='cursor', path=str(path), session=session,
                                key=key, role='user' if b['type'] == 1 else 'assistant',
                                text=b['text'], timestamp=b.get('createdAt'), synthetic=False))
        # UUID key order is not conversational order. Unknown times remain unknown.
        valid_time = lambda r: isinstance(r['timestamp'], (int, float)) and not isinstance(r['timestamp'], bool) and math.isfinite(r['timestamp'])
        records.sort(key=lambda r: (not valid_time(r), r['timestamp'] if valid_time(r) else 0, r['key']))
        for record in records:
            record['order'] = 'timestamp' if valid_time(record) else 'unknown'
            yield record


def sessions(path, project):
    with sqlite3.connect(path.as_uri() + '?mode=ro', uri=True, timeout=1) as db:
        db.execute('PRAGMA query_only=ON')
        try:
            rows = db.execute('SELECT composerId,value FROM composerHeaders WHERE COALESCE(isSubagent,0)=0')
        except sqlite3.Error as e:
            raise HistoryError('unsupported Cursor schema: composerHeaders required') from e
        for sid, raw in rows:
            try:
                meta = json.loads(raw)
            except (ValueError, TypeError):
                notice('malformed Cursor header skipped', session=sid)
                continue
            if not isinstance(meta, dict):
                notice('unsupported Cursor header skipped', session=sid)
                continue
            identifier = meta.get('workspaceIdentifier') or {}
            uri = identifier.get('uri') if isinstance(identifier, dict) else None
            cwd = uri.get('fsPath') if isinstance(uri, dict) else None
            if project and (not cwd or not (cwd == project or cwd.startswith(project.rstrip('/') + '/'))):
                continue
            yield dict(source='cursor', path=str(path), session=sid, project=cwd,
                       title=meta.get('name'), timestamp=meta.get('createdAt'))


def export(path, session):
    with path.open(encoding='utf-8') as f:
        data = json.load(f)
    conversations = data if isinstance(data, list) else [data]
    recognized = False
    for conv in conversations:
        if not isinstance(conv, dict):
            continue
        sid = conv.get('uuid', conv.get('id'))
        if session and sid != session:
            continue
        if isinstance(conv.get('mapping'), dict):
            recognized = True
            mapping = conv['mapping']
            # Follow the selected branch; sibling alternatives are not later corrections.
            node, seen, chain = conv.get('current_node'), set(), []
            if not node:
                raise HistoryError('ChatGPT export has no current_node; cannot infer selected branch')
            while node:
                if node in seen or node not in mapping:
                    raise HistoryError('invalid ChatGPT branch chain')
                seen.add(node)
                item = mapping[node]
                if item.get('message'):
                    chain.append(item['message'])
                node = item.get('parent')
            for m in reversed(chain):
                role = m.get('author', {}).get('role')
                body = text_of(m.get('content'))
                if role in ('user', 'assistant', 'tool') and body:
                    yield dict(source='chatgpt-export', path=str(path), session=sid,
                               key=m.get('id'), role=role, text=body,
                               timestamp=m.get('create_time'), synthetic=False)
        elif isinstance(conv.get('chat_messages'), list):
            recognized = True
            for m in conv['chat_messages']:
                body = m.get('text') or text_of(m.get('content'))
                if body:
                    yield dict(source='claude-export', path=str(path), session=sid,
                               key=m.get('uuid'), role={'human': 'user'}.get(m.get('sender'), m.get('sender')),
                               text=body, timestamp=m.get('created_at'), synthetic=False)
    if not recognized:
        raise HistoryError('unsupported export shape or session not found')


def records(path, session):
    if path.suffix == '.jsonl':
        return jsonl(path)
    if path.suffix == '.vscdb':
        return cursor(path, session)
    if path.suffix == '.json':
        return export(path, session)
    raise HistoryError('expected .jsonl, .json export, or .vscdb')


def discover():
    h = Path.home()
    codex = Path(os.environ.get('CODEX_HOME', h / '.codex'))
    candidates = [('claude', h / '.claude/projects'), ('claude', h / '.config/claude/projects'),
                  ('codex', codex / 'sessions'), ('codex', codex / 'archived_sessions'),
                  ('grok', h / '.grok/sessions')]
    for userdir in (h / 'Library/Application Support/Cursor/User',
                    h / '.config/Cursor/User',
                    Path(os.environ.get('APPDATA', h / 'AppData/Roaming')) / 'Cursor/User'):
        candidates.append(('cursor', userdir / 'globalStorage/state.vscdb'))
    for source, path in candidates:
        yield dict(source=source, path=str(path), available=path.exists())


def candidates(paths, terms):
    if not shutil.which('rg'):
        raise HistoryError('ripgrep (rg) is required for JSONL search')
    # Two workers bound concurrent large-line buffers; measured against default threading.
    cmd = ['rg', '--threads', '2', '--no-config', '--json', '--line-buffered', '--hidden', '--no-ignore',
           '-i', '-F', '-g', '*.jsonl', '-g', '!**/subagents/**']
    for term in terms:
        cmd.extend(['-e', term])
    cmd.extend(['--', *map(str, paths)])
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, text=True, encoding='utf-8', errors='replace')
    try:
        for raw in proc.stdout:
            event = json.loads(raw)
            if event['type'] != 'match':
                continue
            data = event['data']
            if 'text' not in data['path']:
                notice('non-UTF8 path skipped')
                continue
            try:
                decoded = json.loads(data['lines']['text'])
            except (ValueError, KeyError):
                notice('malformed matching JSONL record skipped', path=data['path']['text'])
                continue
            record = decode(decoded, data['path']['text'], data['line_number'])
            if record:
                yield record
        if proc.wait() not in (0, 1):
            raise HistoryError('ripgrep search failed; results may be partial')
    finally:
        proc.stdout.close()
        if proc.poll() is None:
            proc.terminate()
        proc.wait()


def positive(value):
    value = int(value)
    if value < 1:
        raise argparse.ArgumentTypeError('must be positive')
    return value


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    subs = parser.add_subparsers(dest='command', required=True)
    subs.add_parser('discover', help='report default local sources, including missing ones')
    s = subs.add_parser('sessions', help='list Cursor composer IDs from headers only')
    s.add_argument('path', type=Path)
    s.add_argument('--project', help='exact project path or its descendants')
    s.add_argument('--limit', type=positive, default=20, help='maximum headers (default: 20)')
    s = subs.add_parser('search', help='literal OR search; streaming encounter order, not relevance rank')
    s.add_argument('paths', nargs='+', type=Path, help='explicit JSONL roots/files, export, or Cursor DB')
    s.add_argument('-e', '--term', action='append', required=True, help='literal term; repeat for OR')
    s.add_argument('--role', choices=['user', 'assistant', 'all'], default='all')
    s.add_argument('--include-synthetic', action='store_true')
    s.add_argument('--limit', type=positive, default=20, help='maximum hits (default: 20)')
    s.add_argument('--chars', type=positive, default=1200, help='per-hit preview characters (default: 1200)')
    s.add_argument('--session', help='required Cursor composer ID; optional export conversation ID')
    r = subs.add_parser('read', help='read a bounded evidence window including tool records')
    r.add_argument('path', type=Path)
    r.add_argument('--line', type=positive, help='JSONL source line anchor')
    r.add_argument('--key', help='Cursor bubble key or export message ID anchor')
    r.add_argument('--session')
    r.add_argument('--before', type=int, default=2, help='preceding messages (default: 2)')
    r.add_argument('--after', type=int, default=6, help='following messages (default: 6)')
    r.add_argument('--chars', type=positive, default=4000, help='per-record characters (default: 4000)')
    a = parser.parse_args()
    count = 0
    if a.command == 'discover':
        for record in discover():
            emit(record)
        return 0
    if a.command == 'sessions':
        for record in sessions(a.path.resolve(), a.project):
            emit(record)
            count += 1
            if count >= a.limit:
                notice('header limit reached; coverage may be partial', limit=a.limit)
                break
        return 0 if count else 1
    if a.command == 'search':
        if any(not t for t in a.term):
            raise HistoryError('empty search terms are not allowed')
        paths = [p.expanduser().resolve() for p in a.paths]
        if any(not p.exists() for p in paths):
            raise HistoryError('a requested source is missing; run discover or check explicit paths')
        textpaths = [p for p in paths if p.is_dir() or p.suffix == '.jsonl']
        other = [p for p in paths if p not in textpaths]
        def stream():
            if textpaths:
                yield from candidates(textpaths, a.term)
            for p in other:
                yield from records(p, a.session)
        folded_terms = [t.casefold() for t in a.term]
        for record in stream():
            body = record['text']
            if record['role'] not in ('user', 'assistant'):
                continue
            if a.role != 'all' and record['role'] != a.role:
                continue
            if record['synthetic'] and not a.include_synthetic:
                continue
            folded_body = body.casefold()
            if not any(t in folded_body for t in folded_terms):
                continue
            # Center the preview on the earliest literal hit, not on a long preamble.
            offsets = [body.lower().find(t.lower()) for t in a.term]
            start = max(0, min((n for n in offsets if n >= 0), default=0) - a.chars // 4)
            start = min(start, max(0, len(body) - a.chars))
            record.update(text=body[start:start+a.chars], truncated=len(body) > a.chars,
                          preview_start=start)
            emit(record)
            count += 1
            if count >= a.limit:
                notice('hit limit reached; search stopped early, coverage is partial', limit=a.limit)
                break
    else:
        if a.path.suffix == '.json' and not a.session:
            raise HistoryError('export read requires --session to keep windows within one conversation')
        if a.before < 0 or a.after < 0 or bool(a.line) == bool(a.key):
            raise HistoryError('read requires exactly one of --line or --key and nonnegative windows')
        previous = collections.deque(maxlen=a.before)
        remaining = None
        for record in records(a.path.expanduser().resolve(), a.session):
            if remaining is None:
                match = record.get('line') == a.line if a.line else record.get('key') == a.key
                if not match:
                    previous.append(record)
                    continue
                window = list(previous) + [record]
                remaining = a.after
            else:
                window = [record]
                remaining -= 1
            for item in window:
                body = item['text']
                item.update(text=body[:a.chars], truncated=len(body) > a.chars)
                emit(item)
                count += 1
            if remaining == 0:
                break
    return 0 if count else 1


if __name__ == '__main__':
    try:
        sys.exit(main())
    except BrokenPipeError:
        # Consumers such as head may intentionally stop reading early.
        os._exit(0)
    except (HistoryError, OSError, ValueError, sqlite3.Error) as error:
        notice(str(error))
        sys.exit(2)
    except (TypeError, AttributeError, KeyError) as error:
        notice('unsupported record shape', detail=str(error))
        sys.exit(2)
