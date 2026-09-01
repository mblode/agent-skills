---
title: Provide examples in multiple languages when applicable
impact: HIGH
tags: languages, polyglot, sdk
---

## Provide examples in multiple languages when applicable

If your API ships SDKs in several languages, show the same operation in the 2-3 most used, plus `curl` as the language-neutral baseline. Use tabbed code blocks or clearly labeled sections. A Node developer handed only Python has to translate before they can try anything, and translation is where the copy-paste errors come from.

**Incorrect (only one language for a multi-language SDK):**

````markdown
```python
import acme
client = acme.Client(api_key="sk_test_YOUR_TEST_KEY")
user = client.users.create(name="Ada Lovelace")
```
````

**Correct (same operation in each supported stack):**

````markdown
```python
import acme
client = acme.Client(api_key="sk_test_YOUR_TEST_KEY")
user = client.users.create(name="Ada Lovelace")
```

```javascript
import Acme from "acme";
const client = new Acme({ apiKey: "sk_test_YOUR_TEST_KEY" });
const user = await client.users.create({ name: "Ada Lovelace" });
```

```bash
curl -X POST https://api.acme.com/users \
  -H "Authorization: Bearer sk_test_YOUR_TEST_KEY" \
  -d '{"name": "Ada Lovelace"}'
```
````

Reference: [Stripe API reference](https://docs.stripe.com/api)
