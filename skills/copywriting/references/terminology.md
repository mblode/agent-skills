# Product Terminology

Read when the task supplies a glossary, product nouns are inconsistent, or the user asks to establish naming conventions.

## Resolve meaning before replacing words

Locate the product's glossary, house style, approved voice guide, and the relevant UI or API behavior. They answer different questions: terminology defines the object, mechanics define its written form, and voice defines expression. A voice file does not replace a glossary.

Record only terms that affect this task. Use the existing glossary format; when creating one is requested, a useful entry contains:

| Field | Purpose |
|---|---|
| Preferred term | Approved wording and capitalization |
| Meaning and scope | The object or operation it names, including where it does not apply |
| Avoid in this context | Plausible alternatives that cause confusion |
| Example | A realistic use in the product |
| Reason and source | Why the distinction exists and whether it is approved or proposed |

For example, a product may reserve "Subscribe" for following updates and use "plan" for paid access. Replace by meaning, not by a global search-and-replace: the same word can be correct in another flow. This example is not a default vocabulary for other products.

In a scoped edit, retain the source spelling convention unless the supplied house style overrides it. For example, changing a product noun does not justify changing "canceled" to "cancelled".

Preserve approved product names, locale, and meaningful distinctions even when a generic writing preference favors a synonym. If the documented term contradicts the actual consequence, report the conflict rather than hiding it with polished copy. An intentional signature word differs from a stale phrase in one shipped example.

## Keep one owner

Update the consuming project's canonical glossary only when the user requests it; otherwise propose the relevant entries with the copy. Link existing terminology from a voice or brand guide rather than maintaining duplicates. Do not require a particular filename or copy customer-specific terms into the installed skill.

## Automate mechanics where repetition warrants it

Repeated casing, forbidden aliases, or placeholder mistakes can become small project lint checks with stable rule IDs, correct examples, and plausible near-misses. Prefer the existing checker when one exists. Preserve context and exceptions: a regex match alone may not establish which product object a word refers to.

Keep tone, truthfulness, and usefulness as contextual review judgments. A weighted score or word-count limit cannot establish comprehension. Building a shared engine or Figma integration is separate tooling work, not required for a copy pass.
