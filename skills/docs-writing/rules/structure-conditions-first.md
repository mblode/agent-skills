---
title: Put conditions before instructions
impact: CRITICAL
tags: structure, conditions, order, procedures
---

## Put conditions before instructions

State where to be, what to have, or what to check before telling the reader what to do. If you put the instruction first and the condition second, readers may perform the action in the wrong context, then have to undo it. Conditions-first prevents wasted effort and errors.

This applies to prerequisites, UI navigation, and conditional branches.

**Incorrect (instruction before condition):**

```markdown
Click **Save** to apply your changes on the Settings page.

Run the migration script if you're upgrading from version 2.x.

Enter your API key in the **Credentials** field, which you'll find
under **Project Settings > Integrations**.
```

**Correct (condition before instruction):**

```markdown
On the **Settings** page, click **Save** to apply your changes.

If you're upgrading from version 2.x, run the migration script.

Go to **Project Settings > Integrations**. In the **Credentials**
field, enter your API key.
```

Tip: Look for the words "if," "when," "on," and "in" buried at the end of a sentence. Move them to the front.
