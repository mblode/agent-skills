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

Reference: [Google developer documentation style guide: Word list (e.g., i.e.)](https://developers.google.com/style/word-list), [GOV.UK style guide: eg, etc and ie](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/style-guides/a-to-z-style-guide/)
