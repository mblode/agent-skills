---
title: Provide examples in multiple languages when applicable
impact: HIGH
tags: languages, polyglot, sdk
---

## Provide examples in multiple languages when applicable

If your API supports multiple languages, show examples in at least the 2-3 most common ones. Use tabbed code blocks or clearly labeled sections. Don't force Python on a Node.js developer.

**Incorrect (only one language for a multi-language SDK):**

````markdown
```python
import acme
client = acme.Client(api_key="sk_live_abc123")
user = client.users.create(name="Ada Lovelace")
```
````

**Correct (multiple languages let readers use their stack):**

````markdown
```python
import acme
client = acme.Client(api_key="sk_live_abc123")
user = client.users.create(name="Ada Lovelace")
```

```javascript
import Acme from "acme";
const client = new Acme({ apiKey: "sk_live_abc123" });
const user = await client.users.create({ name: "Ada Lovelace" });
```

```bash
curl -X POST https://api.acme.com/users \
  -H "Authorization: Bearer sk_live_abc123" \
  -d '{"name": "Ada Lovelace"}'
```
````

Reference: [Stripe API Documentation](https://docs.stripe.com/api)
