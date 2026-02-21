# TSV Format Specification

## Contents

- [Basic card format](#basic-card-format)
- [Reversed format](#reversed-bidirectional-format)
- [Cloze card format](#cloze-card-format)
- [Field rules](#field-rules)
- [HTML formatting](#html-formatting)
- [Tag syntax](#tag-syntax)
- [Common pitfalls](#common-pitfalls)

## Basic card format

Three tab-separated fields per line. No header row.

```
Field 1: Front (question)
Field 2: Back (answer)
Field 3: Tags
```

Example:

```
What is a race condition?	A race condition occurs when two threads <b>access shared data simultaneously</b> and the outcome depends on execution order.	concurrency priority::high
```

## Reversed (bidirectional) format

Two separate Basic card lines — one forward, one backward. Both tagged with `reversed`.

```
What is the term for a function passed as an argument to another function?	<b>Callback</b>	javascript priority::high reversed
What does a callback do?	A function <b>passed as an argument</b> to another function, invoked after an operation completes	javascript priority::high reversed
```

## Cloze card format

Three tab-separated fields per line. No header row. Field 2 (Extra) is always empty.

```
Field 1: Text (sentence with {{c1::deletions}})
Field 2: Extra (empty)
Field 3: Tags
```

Example:

```
BMI = {{c1::weight (kg)}} / {{c2::height (m)}}²		health-science priority::high formulas
```

Note the two consecutive tabs between the text and tags (empty Extra field).

## Field rules

- No tab characters within field content (tabs are the field delimiter)
- No newlines within field content (newlines are the record delimiter)
- Use `<br>` for line breaks within a field
- Use HTML entities for special characters: `&gt;` for >, `&lt;` for <, `&amp;` for &
- No enclosing quotes around fields
- Trim trailing whitespace

## HTML formatting

Only two HTML tags are allowed:

- `<b>bold</b>` — Key terms in answers. Use on 1-3 key phrases per answer.
- `<br>` — Line breaks within a field.

No other HTML tags (`<i>`, `<ul>`, `<p>`, `<code>`, etc.).

## Tag syntax

Tags are space-separated within the Tags field:

```
topic-tag priority::level modifier
```

**Order:** Topic tag first, then priority, then modifiers.

**Topic tags:**
- Kebab-case: `python-basics`, `web-security`
- Hierarchical topics use `::` separator: `networking::protocols`, `css::layout`

**Priority levels (pick one):**
- `priority::high`
- `priority::medium`
- `priority::low`

**Modifier tags (append after priority, zero or more):**
- `formulas` — Card contains a formula
- `benchmarks` — Card contains a numeric benchmark or threshold
- `reversed` — Card is part of a bidirectional pair

**Examples:**
- `python-basics priority::high`
- `health-science priority::high formulas`
- `javascript priority::medium reversed`

## Common pitfalls

| Pitfall | Problem | Fix |
|---------|---------|-----|
| Spaces instead of tabs | Fields won't parse correctly on import | Use literal tab characters (`\t`) |
| Missing cloze Extra field | Import fails or tags end up in wrong field | Always include two tabs between Text and Tags |
| Markdown instead of HTML | Anki renders HTML, not Markdown | Use `<b>` not `**`, `<br>` not newlines |
| Curly quotes | `{{c1::}}` syntax breaks with smart quotes | Use straight quotes and braces only |
| Unbalanced HTML | `<b>` without `</b>` breaks rendering | Always close HTML tags |
| Tabs in content | Splits a field into two, corrupting the row | Replace with spaces or use `<br>` |
