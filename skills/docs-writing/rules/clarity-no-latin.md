---
title: Write out Latin abbreviations
impact: HIGH
tags: abbreviations, latin, accessibility
---

## Write out Latin abbreviations

Use "for example" not "e.g.," "that is" not "i.e.," "and so on" not "etc." Latin abbreviations trip up screen readers and non-native English speakers.

**Incorrect (Latin abbreviations assume familiarity):**

```markdown
Supports multiple formats, e.g., JSON, XML, etc. The config
file (i.e., the main settings file) must be valid YAML.
```

**Correct (written-out forms are universally clear):**

```markdown
Supports multiple formats, for example, JSON and XML. The config
file (that is, the main settings file) must be valid YAML.
```

Reference: [Google Developer Documentation Style Guide — Abbreviations](https://developers.google.com/style/abbreviations)
