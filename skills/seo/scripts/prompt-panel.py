#!/usr/bin/env python3
"""Run and score a repeated AI-search prompt panel through provider APIs.

  prompt-panel.py run PROMPTS.json OUT.jsonl [--engines openai,claude,gemini,perplexity] [--runs 5] [--country US]
  prompt-panel.py score PROMPTS.json OUT.jsonl

PROMPTS.json: {"brand": "Done Bear", "match": "done\\\\s?bear",
               "owned": ["donebear.com"], "owned_off_domain": ["github.com/mblode/donebear"],
               "prompts": [{"kind": "category" | "recall", "q": "..."}]}

Every series is an API series ("OpenAI API", not "ChatGPT"); never trend it with app or SERP data.
Keys come from the environment only: OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY,
PERPLEXITY_API_KEY. Each provider is called directly, because a model gateway can drop citations.
"""
import argparse, collections, json, os, re, sys, threading, time, urllib.error, urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from urllib.parse import urlparse


def post(url, body, headers, timeout=180):
    req = urllib.request.Request(url, data=json.dumps(body).encode(),
                                 headers={"Content-Type": "application/json", **headers})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            msg = e.read().decode()[:300]
            if e.code in (429, 500, 502, 503, 529) and attempt < 3:
                time.sleep(10 * (attempt + 1)); continue
            raise RuntimeError(f"HTTP {e.code}: {msg}")
        except urllib.error.URLError:
            if attempt < 3: time.sleep(5); continue
            raise


def openai(q, country):
    d = post("https://api.openai.com/v1/responses",
             {"model": "gpt-5.5", "input": q, "reasoning": {"effort": "low"},
              "tools": [{"type": "web_search", "user_location": {"type": "approximate", "country": country}}]},
             {"Authorization": "Bearer " + os.environ["OPENAI_API_KEY"]})
    text, urls = "", []
    for item in d.get("output", []):
        if item.get("type") == "message":
            for c in item.get("content", []):
                text += c.get("text", "")
                urls += [a["url"] for a in c.get("annotations", []) if a.get("type") == "url_citation"]
    return "OpenAI API gpt-5.5 + web_search", text, urls


def claude(q, country):
    d = post("https://api.anthropic.com/v1/messages",
             {"model": "claude-sonnet-5-5", "max_tokens": 2500, "messages": [{"role": "user", "content": q}],
              "tools": [{"type": "web_search_20250305", "name": "web_search", "max_uses": 3,
                         "user_location": {"type": "approximate", "country": country}}]},
             {"x-api-key": os.environ["ANTHROPIC_API_KEY"], "anthropic-version": "2023-06-01"})
    text, urls = "", []
    for b in d.get("content", []):
        if b.get("type") == "text":
            text += b.get("text", "")
            urls += [c["url"] for c in b.get("citations") or [] if c.get("url")]
    return "Anthropic API claude-sonnet-5-5 + web_search", text, urls


def gemini(q, country):
    d = post("https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key="
             + os.environ["GEMINI_API_KEY"],
             {"contents": [{"parts": [{"text": q}]}], "tools": [{"google_search": {}}]}, {})
    c = d["candidates"][0]
    text = "".join(p.get("text", "") for p in c.get("content", {}).get("parts", []))
    # Grounding URIs are redirects; the chunk title carries the source domain.
    urls = ["https://" + (ch["web"].get("title") or "") + "/"
            for ch in c.get("groundingMetadata", {}).get("groundingChunks", []) if "web" in ch]
    return "Gemini API gemini-flash-latest + Google Search grounding (no locale control)", text, urls


def perplexity(q, country):
    d = post("https://api.perplexity.ai/chat/completions",
             {"model": "sonar", "messages": [{"role": "user", "content": q}],
              "web_search_options": {"user_location": {"country": country}}},
             {"Authorization": "Bearer " + os.environ["PERPLEXITY_API_KEY"]})
    urls = list(d.get("citations") or []) + [s["url"] for s in d.get("search_results") or [] if s.get("url")]
    return "Perplexity API sonar", d["choices"][0]["message"].get("content") or "", urls


ENGINES = {"openai": (openai, "OPENAI_API_KEY"), "claude": (claude, "ANTHROPIC_API_KEY"),
           "gemini": (gemini, "GEMINI_API_KEY"), "perplexity": (perplexity, "PERPLEXITY_API_KEY")}


def run(a):
    spec = json.load(open(a.prompts))
    engines = a.engines.split(",")
    missing = [e for e in engines if e not in ENGINES or not os.environ.get(ENGINES[e][1])]
    if missing:
        sys.exit(f"no key in the environment (or unknown engine) for: {', '.join(missing)}")
    jobs = [(p, e, r) for p in spec["prompts"] for e in engines for r in range(a.runs)]
    print(f"{len(jobs)} calls: {len(spec['prompts'])} prompts x {len(engines)} engines x {a.runs} runs", flush=True)
    lock = threading.Lock()

    def job(j):
        p, e, r = j
        rec = {"brand": spec["brand"], "kind": p["kind"], "prompt": p["q"], "engine": e, "run": r,
               "country": a.country, "method": "api", "ts": datetime.now(timezone.utc).isoformat()}
        try:
            rec["model"], rec["text"], rec["urls"] = ENGINES[e][0](p["q"], a.country)
        except Exception as ex:
            rec["error"] = str(ex)
        with lock, open(a.out, "a") as f:
            f.write(json.dumps(rec) + "\n")

    with ThreadPoolExecutor(8) as ex:
        list(ex.map(job, jobs))


def score(a):
    spec = json.load(open(a.prompts))
    match = re.compile(spec["match"], re.I)
    owned, off = tuple(spec.get("owned", [])), tuple(spec.get("owned_off_domain", []))

    def kind_of(u):
        p = urlparse(u); h = p.netloc.lower().removeprefix("www.")
        if any(h == o or h.endswith("." + o) for o in owned): return "owned"
        if any((h + p.path).startswith(o) for o in off): return "owned_off_domain"
        return "other"

    recs = [json.loads(l) for l in open(a.out)]
    errors = sum("error" in r for r in recs)
    agg = collections.defaultdict(lambda: collections.Counter())
    cited = collections.defaultdict(collections.Counter)
    for r in (r for r in recs if "error" not in r):
        kinds = {kind_of(u) for u in r["urls"]}
        c = agg[(r["kind"], r["model"], r["prompt"])]
        c["runs"] += 1
        c["cited_owned"] += "owned" in kinds
        c["cited_off_domain"] += "owned_off_domain" in kinds
        if r["kind"] == "category":
            c["named"] += bool(match.search(r["text"]))
            for u in r["urls"]:
                cited[r["model"]][urlparse(u).netloc.lower().removeprefix("www.")] += 1
    print(f"errors {errors}")
    for (kind, model, prompt), c in sorted(agg.items()):
        named = f"named {c['named']}/{c['runs']}  " if kind == "category" else "correctness: review text by hand  "
        print(f"[{kind}] {model} | {named}cited owned {c['cited_owned']}/{c['runs']}  "
              f"off-domain {c['cited_off_domain']}/{c['runs']} | {prompt}")
    for model, doms in cited.items():
        print(f"\n{model} top cited domains (category prompts): {doms.most_common(10)}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    r = sub.add_parser("run"); s = sub.add_parser("score")
    for p in (r, s):
        p.add_argument("prompts"); p.add_argument("out")
    r.add_argument("--engines", default="openai,claude,gemini")
    r.add_argument("--runs", type=int, default=5)
    r.add_argument("--country", default="US")
    a = ap.parse_args()
    if a.cmd == "run" and a.runs < 5:
        sys.exit("--runs must be at least 5; cut prompts instead of runs")
    (run if a.cmd == "run" else score)(a)
