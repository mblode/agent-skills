---
title: Accept and Emit Structured JSON, Errors Included
impact: HIGH
impactDescription: lets an agent pass a whole payload and parse a whole response, errors and all
tags: cli, json, agents, stdin, errors
---

## Accept and Emit Structured JSON, Errors Included

An agent drives a CLI by piping a JSON payload in and parsing JSON out, so accept a `--json` or stdin payload instead of forcing an interactive prompt, and in structured mode emit either the result or a `{ error, code, message, details }` envelope on stdout with the human hint on stderr and a non-zero exit. This complements `cli-pipes-tty-and-json` (which owns the output and TTY side), reuses the code from `err-stable-error-codes`, and puts the remedy from `err-suggest-the-fix` on stderr.

**Incorrect (input only from a prompt, prose error mixed into stdout, exit 0):**

```ts
const title = await text({ message: "Issue title?" }); // hangs under a pipe
try {
  const issue = await createIssue({ title });
  console.log(`Created ${issue.id}`);
} catch {
  console.log("Oops, something went wrong"); // prose on stdout, no code, still exits 0
}
```

**Correct (structured payload in, JSON envelope out, hint to stderr, non-zero exit):**

```ts
const payload = flags.json ? JSON.parse(flags.json) : JSON.parse(await readStdin());
try {
  const issue = await createIssue(payload);
  process.stdout.write(JSON.stringify(issue)); // clean, parseable result
} catch (err) {
  process.stdout.write(
    JSON.stringify({ error: true, code: "CREATE_FAILED", message: String(err), details: {} }),
  );
  console.error("Hint: run `mytool schema issues.create` to check the payload."); // stderr
  process.exitCode = 1;
}
```
