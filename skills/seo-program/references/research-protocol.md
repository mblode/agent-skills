# Research Protocol

How to pull keyword and prompt volumes so the numbers survive review. Read during step 2 of the workflow.

## Contents

- Before pulling
- Keyword volume
- Prompt volume
- Match types
- Recording the result
- No data
- Logins

## Before pulling

Confirm which tool is bound to each job (step 1 of the workflow). Use the connected tool, not the tool you know best. If two are connected, prefer the one the team already reports from, so the numbers in the brief reconcile with the numbers in their dashboard.

## Keyword volume

1. Search the primary term and its close variants in the bound keyword tool.
2. Scope global unless the user asked for a country. A US-only pull presented as global is the most common silent error here.
3. Read the monthly search volume for the primary, then for each secondary you intend to put in the brief.
4. Note the date window the tool reports (most report a trailing 12-month average, some report last month).

The primary keyword needs a modifier. Bare role and category nouns aggregate every intent that shares the word:

| Too broad | Usable primary |
|---|---|
| `data analyst` | `ai data analyst` |
| `newsletter` | `ai newsletter writer` |
| `dashboard` | `revenue dashboard template` |

A bare noun's volume is real but unwinnable and unattributable: the page cannot serve job-seekers, tool-shoppers, and definition-seekers at once.

## Prompt volume

Prompt volume measures how often people ask an answer engine something, and it is a different number from search volume. Pull it from the bound AI-visibility tool.

1. Query the exact phrasing a person would type into a chat assistant, not the keyword.
2. Read the **Exact** match figure.
3. List supporting prompts underneath, primary first, each tagged with its match type.

## Match types

| Match type | Meaning | Use as the number? |
|---|---|---|
| Exact | the terms, in the order given | Yes. This is the figure to record. |
| Phrase | the terms, order not guaranteed | No |
| Broad / any-order | the terms appear somewhere | No |

Phrase and any-order matches inflate on multi-word terms because they absorb unrelated queries that happen to contain the words. A Phrase number recorded as prompt volume promotes a niche topic to the top of the queue.

If Exact returns nothing, leave the number blank and say Exact had no data. Do not substitute the Phrase figure and do not annotate it as approximate.

## Recording the result

Every figure carries three things or it is not usable:

| Keyword | Search volume | Exact prompt volume | Source, scope, window |
|---|---|---|---|
| <primary, with modifier> | <number from the tool> | <number, or "No data"> | <tool>, <global or country>, <window>, pulled <date> |
| <secondary> | <number from the tool> | <number, or "No data"> | <tool>, <global or country>, <window>, pulled <date> |

Placeholders, not sample figures. Filling this table means running the pull; a plausible-looking number typed from memory is the exact failure the rest of this file exists to prevent.

Without the source and window, next month's pull cannot be compared with this one and the trend is guesswork.

## No data

"No data" is a finding, not a failure. Write it in the cell. It tells the reader the tool was consulted, which an empty cell does not.

Never estimate, interpolate from a related term, or carry a number over from a previous pull to fill the gap.

## Logins

If the tool requires a sign-in, hand the browser to the user and let them authenticate. Never type credentials, and never store them anywhere in the brief or the notes.
