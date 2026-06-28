# HTML question form (batch mode)

Optional alternative to one-at-a-time interrogation: generate a single local HTML form with all independent questions, let the user fill it in at once, then read their answers back. Useful for large or greenfield specs where many questions don't depend on each other.

## When to use batch vs one-at-a-time

| Use batch (HTML form) | Use one-at-a-time (default) |
|---|---|
| Greenfield spec with many independent decisions | Each answer changes which question comes next |
| User wants to fill things in async / offline | A short, branching investigation |
| 8+ questions that mostly stand alone | Fewer than ~6 questions |
| User explicitly asks for "a form" or "questionnaire" | The codebase scan already answers most of it |

If answers are interdependent, stay one-at-a-time: a form can't branch.

## How it works

1. Write the form to a temp path (e.g. `~/.claude/plans/<slug>-questions.html`).
2. Tell the user to open it, fill it in, click **Copy answers**, and paste the result back into chat.
3. Parse the pasted block, fold answers into the plan, and continue at Step 3 (Synthesize). For any blanks, fall back to a recommended answer or a quick follow-up.

Each question still carries a **recommended answer** (pre-selected or pre-filled) so the user reacts to a concrete suggestion, the same rule as one-at-a-time.

## Template

Self-contained, no dependencies. The **Copy answers** button serializes every field into a paste-ready block.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Plan questions</title>
<style>
  body { font: 16px/1.5 system-ui, sans-serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem; }
  fieldset { border: 1px solid #ccc; border-radius: 8px; margin: 0 0 1rem; padding: 1rem; }
  legend { font-weight: 600; padding: 0 .4rem; }
  .rec { color: #555; font-size: .85em; margin: .25rem 0 .75rem; }
  label { display: block; margin: .25rem 0; }
  textarea, input[type=text] { width: 100%; font: inherit; padding: .4rem; box-sizing: border-box; }
  button { font: inherit; padding: .6rem 1rem; border-radius: 8px; cursor: pointer; }
  #out { white-space: pre-wrap; background: #f6f6f6; padding: 1rem; border-radius: 8px; }
</style>
</head>
<body>
<h1>Plan questions</h1>
<form id="f">
  <!-- Repeat one fieldset per question. data-q = the question key. -->
  <fieldset data-q="storage">
    <legend>Where should sessions be stored?</legend>
    <p class="rec">Recommended: Redis (the app already runs one for caching).</p>
    <label><input type="radio" name="storage" value="Redis" checked /> Redis</label>
    <label><input type="radio" name="storage" value="Postgres" /> Postgres</label>
    <label><input type="radio" name="storage" value="Other" /> Other (note below)</label>
  </fieldset>

  <fieldset data-q="scope">
    <legend>Anything explicitly out of scope?</legend>
    <p class="rec">Recommended: defer SSO to a later phase.</p>
    <textarea name="scope" rows="3">Defer SSO</textarea>
  </fieldset>
</form>

<button type="button" onclick="copyAnswers()">Copy answers</button>
<pre id="out" hidden></pre>

<script>
function copyAnswers() {
  const lines = [];
  document.querySelectorAll('#f fieldset').forEach(fs => {
    const key = fs.dataset.q;
    const el = fs.querySelector('[name="' + key + '"]');
    let val;
    if (el && el.type === 'radio') {
      const checked = fs.querySelector('[name="' + key + '"]:checked');
      val = checked ? checked.value : '';
    } else {
      val = el ? el.value.trim() : '';
    }
    lines.push(key + ': ' + val);
  });
  const text = lines.join('\n');
  const out = document.getElementById('out');
  out.hidden = false;
  out.textContent = text;
  navigator.clipboard && navigator.clipboard.writeText(text);
}
</script>
</body>
</html>
```

## Parsing the answers

The pasted block is `key: value` lines, one per question. Match each `data-q` key to its question, treat empty values as "use the recommendation", and ask a single follow-up only if a load-bearing answer is missing or contradictory.
