---
title: Follow XDG Base Dirs and a Clear Precedence Order
impact: MEDIUM
impactDescription: puts config where users expect it and makes overrides predictable
tags: config, xdg, precedence, environment
---

## Follow XDG Base Dirs and a Clear Precedence Order

Store user config under the XDG base directories (`$XDG_CONFIG_HOME`, or `~/.config/<tool>`) instead of scattering dotfiles across `$HOME`, and resolve overlapping sources in one documented order so a value's origin is never a mystery.

**Incorrect (a dotfile in $HOME, and an undocumented merge order):**

```ts
const path = join(homedir(), ".mytoolrc"); // clutters $HOME, ignores XDG
const config = { ...readConfig(path), ...envConfig }; // which one wins? undocumented
```

**Correct (XDG location, explicit precedence highest-wins):**

```ts
const base = process.env.XDG_CONFIG_HOME ?? join(homedir(), ".config");
const path = join(base, "mytool", "config.json");
// precedence, highest wins: flags > env > project > user file > system
const config = { ...system, ...userFile, ...project, ...env, ...flags };
```
