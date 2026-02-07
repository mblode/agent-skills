---
title: Use three-column layout for API reference docs
impact: MEDIUM
tags: api-docs, layout, three-column
---

## Use three-column layout for API reference docs

API reference docs work best with three columns: navigation (left), description (center), and code examples (right). This lets developers read the explanation and see the code simultaneously without scrolling.

**Incorrect (code blocks inline below each description):**

```markdown
## Create a user

Creates a new user account with the specified parameters.

### Request

POST /api/users

### Example

    curl -X POST https://api.example.com/users \
      -d '{"name": "Ada"}'
```

**Correct (description and code columns visually adjacent):**

```markdown
<!-- Three-column layout: nav | description | code -->
| Description                          | Example                              |
|--------------------------------------|--------------------------------------|
| **POST /api/users**                  | `curl -X POST .../users -d '{...}'` |
| Creates a new user with the          |                                      |
| specified parameters.                | Response: `201 Created`              |
```

Reference: [Stripe API docs — Layout pattern](https://docs.stripe.com/api)
