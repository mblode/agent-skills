# Source Endpoints

Per-host public endpoints that return text or a clean binary instead of HTML chrome, each one exercised with `curl -sSL` from a cloud sandbox. Read the row for the URL's host, run the line, and check the `Content-Type` you got against the one listed; a mismatch means a wall, not a parse problem.

## Contents

- How to use a row
- GitHub and Gist
- X and Twitter
- Google Docs, Sheets, Slides, Drive
- arXiv
- Wikipedia
- Reddit and Hacker News
- YouTube
- Docs sites and Markdown for Agents
- Blogs and newsletters
- Binary files on disk
- Turning VTT captions into text

## How to use a row

Every line assumes `curl -sSL -o <file>`: `-L` because several hosts answer with a cross-host redirect (oEmbed 301s to `publish.x.com`, GitHub `?raw=true` 302s to `raw.githubusercontent.com`, Drive 303s to `drive.usercontent.google.com`), and harness fetch tools return those redirects to you instead of following them. Add `-w '%{http_code} %{content_type}\n'` on the first try so the wall shows up before you parse.

## GitHub and Gist

| Given | Fetch | Returns |
|-------|-------|---------|
| `github.com/<o>/<r>/blob/<ref>/<path>` | `https://raw.githubusercontent.com/<o>/<r>/<ref>/<path>` (or append `?raw=true` and follow the 302) | `text/plain`, the file |
| `gist.github.com/<user>/<id>` | `https://gist.github.com/<user>/<id>/raw` (redirects to `gist.githubusercontent.com`); add `/<filename>` for one file of a multi-file gist | `text/plain` |
| Any `github.com` page with `Accept: text/markdown` | Ignored; GitHub serves HTML regardless | 276 KB of HTML |

Private repos: `gh api repos/<o>/<r>/contents/<path> -H 'Accept: application/vnd.github.raw'` uses the credential the harness already has.

## X and Twitter

| Given | Fetch | Returns |
|-------|-------|---------|
| `x.com/<user>/status/<id>` or `twitter.com/...` | `https://publish.twitter.com/oembed?url=<tweet url>` (301 to `publish.x.com`; both hosts accept both URL forms) | JSON: `author_name`, `url`, and `html` holding the text and date in a `<blockquote>` |
| Same, no oEmbed | The x.com HTML shell with a browser User-Agent carries the text only in `og:description`; no author line, no date, no thread | 165 KB of SPA shell |

Keep text, author, date. Threads and replies are not in oEmbed; say so rather than fetching each id from memory. `api.fxtwitter.com` returns richer JSON but is a third party, so it stays out.

## Google Docs, Sheets, Slides, Drive

All require "Anyone with the link" or published. A private file returns 404 on every export URL, not 403 or a login page, so a 404 here is a permissions message.

| Given | Fetch | Returns |
|-------|-------|---------|
| `docs.google.com/document/d/<id>/edit` | `https://docs.google.com/document/d/<id>/export?format=md` (`format=markdown` is an alias; `txt`, `docx`, `pdf`, `epub`, `html` also work) | `text/x-markdown` with headings, links, and lists preserved |
| `docs.google.com/document/d/e/<pubid>/pub` (published) | No export URL; the `/pub` page is HTML and `?output=txt` is ignored. Strip the page body | HTML |
| `docs.google.com/spreadsheets/d/<id>/edit#gid=<n>` | `https://docs.google.com/spreadsheets/d/<id>/export?format=csv&gid=<n>` (omit `gid` for the first sheet; `format=xlsx` for the whole workbook) | `text/csv` |
| `docs.google.com/presentation/d/<id>/edit` | `https://docs.google.com/presentation/d/<id>/export/txt` for the speaker text and slide text in order; `/export/pdf` when layout or figures matter, then Read the PDF | `text/plain` or `application/pdf` |
| `drive.google.com/file/d/<id>/view` | `https://drive.google.com/uc?export=download&id=<id>` (303 to `drive.usercontent.google.com/download`) | The file, with `Content-Disposition` naming it |

Drive files over about 25 MB return an HTML "Download warning" page instead of the file (Google cannot virus-scan them). Its form carries `confirm=t` and a `uuid`; re-request `https://drive.usercontent.google.com/download?id=<id>&export=download&confirm=t&uuid=<uuid>`.

## arXiv

| Given | Fetch | Returns |
|-------|-------|---------|
| `arxiv.org/abs/<id>` | `https://arxiv.org/html/<id>` (LaTeXML HTML, clean sections, MathML) | `text/html` around 190 KB for a full paper |
| Same, `/html/` returns 404 | `https://arxiv.org/pdf/<id>` then Read; HTML exists only where LaTeXML conversion succeeded, roughly three quarters of recent papers and few older ones | `application/pdf` |

The `/abs/` page is 44 KB of abstract and metadata. Saving it as the paper is the failure this row exists to prevent. A version suffix (`<id>v7`) pins the revision on both endpoints.

## Wikipedia

| Given | Fetch | Returns |
|-------|-------|---------|
| `en.wikipedia.org/wiki/<Title>` | `https://en.wikipedia.org/w/index.php?title=<Title>&action=render` (article body HTML, no site chrome; convert to markdown) | `text/html` |
| Same, wikitext wanted | `https://en.wikipedia.org/wiki/<Title>?action=raw` | `text/x-wiki`: templates, infobox markup, and `{{cite}}` calls that do not convert cleanly |
| Same, structured | `https://en.wikipedia.org/api/rest_v1/page/html/<Title>` | Parsoid HTML with `data-mw` attributes |

Send a descriptive `User-Agent` (`-A 'save-md (contact: you@example.com)'`). The REST API answered a short anonymous burst with 429 in testing; the `index.php` endpoints did not.

## Reddit and Hacker News

| Given | Fetch | Returns |
|-------|-------|---------|
| `reddit.com/r/<sub>/comments/<id>/...` | Nothing anonymous works: `.json`, `api.reddit.com`, and `old.reddit.com` return 403 or a login redirect from datacenter IPs regardless of User-Agent (Reddit deprecated unauthenticated JSON) | Stop. Name the OAuth API or a logged-in browser as the path |
| `news.ycombinator.com/item?id=<id>` | `https://hacker-news.firebaseio.com/v0/item/<id>.json` for the item; `kids` are comment ids fetched the same way. Or curl the HTML page, which is server-rendered | JSON or `text/html` |

A Reddit thread pasted by the user is a conversation source: keep speakers and order, `type: conversation`.

## YouTube

| Given | Fetch | Returns |
|-------|-------|---------|
| `youtube.com/watch?v=<id>` or `youtu.be/<id>` | `yt-dlp --write-auto-sub --write-sub --sub-lang en --skip-download -o "<name>" <url>` | `<name>.en.vtt`; when the video has both manual and auto captions two files land, and the manual one is the transcript |
| Title, channel, and thumbnail only | `https://www.youtube.com/oembed?url=<url>&format=json` | JSON; no transcript, no description |
| Watch page HTML | Contains `captionTracks` with signed `timedtext` URLs that expire and increasingly need a proof-of-origin token; not worth scripting when `yt-dlp` is a `pip install` away | 1.3 MB of HTML |

`yt-dlp` fetched auto-captions from a cloud sandbox with no cookies. If it is not on PATH after `pip install --target`, `python3 -m yt_dlp` runs it. Its two warnings (no JavaScript runtime, no impersonation target) do not affect subtitles. "Sign in to confirm you're not a bot" is an IP-reputation block: `--cookies-from-browser firefox` on the user's machine, or stop in a sandbox.

## Docs sites and Markdown for Agents

| Given | Fetch | Returns |
|-------|-------|---------|
| Any docs page | Same URL with `-H 'Accept: text/markdown'` | `Content-Type: text/markdown` plus `x-markdown-tokens` when the site converts; HTML when it does not (check the type, the status is 200 either way) |
| Some docs sites | Same path with `.md` appended, or `index.md` for a directory | `text/markdown` |

Confirmed converting on `developers.cloudflare.com`, `platform.claude.com/docs`, `vercel.com/docs`, and `docs.stripe.com` (which also serves `/api.md`). Cloudflare offers the conversion to any zone on a paid plan that enables it, so try the header on any docs site before parsing HTML. Markdown answers also pass through harness fetch tools without summarization when under 100K characters, so this is the one case where the fetch tool returns the page.

## Blogs and newsletters

| Given | Fetch | Returns |
|-------|-------|---------|
| Substack (`*.substack.com` or a custom domain) | `curl -sSL -A 'Mozilla/5.0'`; the post is server-rendered inside `<div class="body markup">` | `text/html`, full post for free posts, teaser only behind the paywall |
| Medium | 403 to datacenter IPs | Stop; the user can paste the text or export from Medium |
| Anything behind Cloudflare's challenge page | 403 or a `cf-chl` interstitial | A browser tool if the harness has one; else stop |

## Binary files on disk

Convert with what the box has, in this order, and skip installs for these formats:

| Format | Path |
|--------|------|
| PDF | Read the file directly (the harness Read tool handles pages). Under about 100 characters per page: render to images and read with vision |
| DOCX, PPTX, XLSX | `pandoc -t gfm <file>` if present; else `soffice --headless --convert-to txt <file>` (or `--convert-to csv` for sheets); else `unzip -p <file> word/document.xml` (`ppt/slides/slide*.xml`, `xl/sharedStrings.xml`) and strip tags |
| EPUB | `unzip` the container and read the `.xhtml` files in `OEBPS/` spine order |
| Images | Vision: transcribe visible text first, describe the rest after |

Trust `Content-Type` and `Content-Disposition` from the download over the URL suffix; Drive and Sheets exports carry no extension in the URL at all.

## Turning VTT captions into text

Auto-generated VTT repeats each line across two cues (once with word timings, once plain) and interleaves `[Music]` markers. Keep the plain form of each cue once, in order, and join into paragraphs on the gaps between cues. Manual captions (`--write-sub`) do not duplicate and can be used as-is after dropping the timestamp lines. Either way the saved file is `type: youtube` with `source:` the watch URL.
