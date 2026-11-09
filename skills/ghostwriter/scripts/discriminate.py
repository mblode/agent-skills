#!/usr/bin/env python3
"""Blind human-likeness test for a voice profile.

For each held-out real message, draft the same message with and without this
skill, then ask a different model which of the pair a person wrote. A judge
that picks the real message about half the time cannot tell the drafts from
the writer.

Input is JSONL kept outside any repository, one message per line:
  {"platform": "slack", "context": "dm", "situation": "...", "text": "..."}
`situation` is one neutral sentence about what the message does, with no
names. Redact names and links in `text` the same way the drafts are asked to
([Name], [link]), or the placeholders give the drafts away.

  python3 scripts/discriminate.py held-out.jsonl --as "Sam Ellery" \
      --model claude-opus-5-5 --judge claude-sonnet-5-5 --out results

Needs the `claude` CLI. Never use messages that also feed the profile's
rules or excerpts.
"""

import argparse
import concurrent.futures
import json
import re
import pathlib
import subprocess
import tempfile
import zlib

SKILL_DIR = pathlib.Path(__file__).resolve().parent.parent

CONTEXT = {
    "channel": "a reply in a team channel thread",
    "dm": "a direct message in an ongoing conversation",
    "email-new": "a new email",
    "email-reply": "a reply in an email thread",
    "group": "a message in a group chat",
}


def claude(args, prompt):
    with tempfile.TemporaryDirectory() as cwd:
        done = subprocess.run(
            ["claude", "-p", *args], input=prompt, capture_output=True,
            text=True, cwd=cwd, check=False,
        )
    return done.stdout.strip()


def draft(item, writer, model, with_skill):
    context = CONTEXT.get(item.get("context", ""), item.get("context", ""))
    ask = (
        f"I'm {writer}. Write this {item['platform']} message as me"
        f"{f' ({context})' if context else ''}. Situation: {item['situation']} "
        "Write [Name] or [link] where a real name or link would go. "
        "Return only the message."
    )
    args = ["--model", model]
    if with_skill:
        skill = (SKILL_DIR / "SKILL.md").read_text()
        args += [
            "--append-system-prompt",
            f"{skill}\n\nThe skill folder is {SKILL_DIR}; read its files when SKILL.md points to them.",
            "--add-dir", str(SKILL_DIR),
            "--allowedTools", "Read,Glob,Grep",
        ]
    return claude(args, ask)


def caught(item, generated, judge):
    real_first = zlib.crc32(item["situation"].encode()) % 2 == 0
    a, b = (item["text"], generated) if real_first else (generated, item["text"])
    verdict = claude(
        ["--model", judge],
        f"Two {item['platform']} messages were written for the same situation. "
        "One was typed by a person, the other was written by an AI. Names and "
        f"links may be replaced with placeholders in either.\n\nSituation: "
        f"{item['situation']}\n\nA:\n{a}\n\nB:\n{b}\n\nWhich one did the person "
        "write? Answer with the single letter A or B.",
    )
    found = re.search(r"\b([AB])\b", verdict)
    pick = found.group(1) if found else "A"
    return (pick == "A") != real_first


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("files", nargs="+")
    parser.add_argument("--as", dest="writer", required=True)
    parser.add_argument("--model", default="claude-opus-5-5")
    parser.add_argument("--judge", default="claude-sonnet-5-5")
    parser.add_argument("--limit", type=int, default=40)
    parser.add_argument("--concurrency", type=int, default=4)
    parser.add_argument("--out", default="discriminate-results")
    opts = parser.parse_args()
    if opts.judge == opts.model:
        parser.error("--judge must differ from --model")

    items = [
        json.loads(line)
        for path in opts.files
        for line in pathlib.Path(path).read_text().splitlines()
        if line.strip()
    ][: opts.limit]

    def run(job):
        item, with_skill = job
        generated = draft(item, opts.writer, opts.model, with_skill)
        return {
            "arm": "with_skill" if with_skill else "without_skill",
            "caught": caught(item, generated, opts.judge),
            "generated": generated,
            "platform": item["platform"],
            "situation": item["situation"],
        }

    jobs = [(item, arm) for item in items for arm in (True, False)]
    with concurrent.futures.ThreadPoolExecutor(opts.concurrency) as pool:
        rows = list(pool.map(run, jobs))

    out = pathlib.Path(opts.out)
    out.mkdir(parents=True, exist_ok=True)
    (out / "rows.jsonl").write_text(
        "".join(json.dumps(r, ensure_ascii=False) + "\n" for r in rows)
    )
    for arm in ("with_skill", "without_skill"):
        mine = [r for r in rows if r["arm"] == arm]
        hits = sum(r["caught"] for r in mine)
        share = round(100 * hits / max(len(mine), 1))
        print(f"{arm}: judge spotted the AI draft {hits}/{len(mine)} ({share}%, 50% is indistinguishable)")


if __name__ == "__main__":
    main()
