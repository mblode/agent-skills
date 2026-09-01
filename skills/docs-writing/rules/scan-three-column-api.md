---
title: Keep request and response examples beside each API reference entry
impact: MEDIUM
tags: api-docs, layout, reference, examples
---

## Keep request and response examples beside each API reference entry

Stripe's API reference puts parameters in one column and a request plus its response in the other, so the reader never scrolls between "what does this take" and "what does the call look like." Docs frameworks (Mintlify, Fern, Redocly, Docusaurus OpenAPI) render that two-pane layout from the source; what the author controls is that every endpoint entry carries its own request example and response example, in that order, immediately after its parameters. A reference page that describes ten endpoints and then dumps all the examples at the bottom has the same content and none of the usefulness.

**Incorrect (examples gathered at the end, away from the parameters they show):**

```markdown
## Create a user

Creates a user. Parameters: `name` (required), `email` (required).

## Retrieve a user

Retrieves a user by ID.

## Examples

    curl -X POST https://api.acme.com/users -d '{"name": "Ada"}'
    curl https://api.acme.com/users/usr_abc123
```

**Correct (each entry: parameters, then request, then response):**

````markdown
## Create a user

`POST /v1/users`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | yes | Full name shown in the dashboard |
| `email` | string | yes | Must be unique per account |

Request:

```bash
curl -X POST https://api.acme.com/v1/users \
  -u sk_test_YOUR_TEST_KEY: \
  -d name="Ada Lovelace" -d email="ada@example.com"
```

Response:

```json
{ "id": "usr_abc123", "name": "Ada Lovelace", "email": "ada@example.com" }
```
````

Reference: [Stripe API reference](https://docs.stripe.com/api), [Diataxis: Reference](https://diataxis.fr/reference/)
