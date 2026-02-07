---
title: Bold for UI elements, code font for technical terms
impact: MEDIUM-HIGH
tags: formatting, ui-elements, code-font
---

## Bold for UI elements, code font for technical terms

Use **bold** for UI elements the reader interacts with (buttons, menu items, page names, tabs). Use `code font` for filenames, commands, parameters, functions, and API elements. Mixing these up makes docs harder to scan.

**Incorrect (no visual distinction between UI and code):**

```markdown
Click the Submit button and check the config.yaml file. Go to the
Settings page and update the timeout parameter.
```

**Correct (bold for UI, code font for technical terms):**

```markdown
Click **Submit** and check the `config.yaml` file. Go to the
**Settings** page and update the `timeout` parameter.
```

Reference: [Microsoft Style Guide — Formatting text in instructions](https://learn.microsoft.com/en-us/style-guide/procedures-instructions/formatting-text-in-instructions)
