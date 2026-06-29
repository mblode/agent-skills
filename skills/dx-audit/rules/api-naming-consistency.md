---
title: Name the Public API Consistently
impact: CRITICAL
impactDescription: lets developers guess the next method correctly instead of reading source
tags: api, naming, consistency
---

## Name the Public API Consistently

Pick one verb per concept and one casing scheme, then hold them across the whole surface. Mixed `get`/`fetch`/`load`, mixed `delete`/`remove`, or mixed `camelCase`/`snake_case` forces the developer to memorize each name instead of guessing it. Consistency is what makes an API learnable.

**Incorrect (three verbs for one concept, mixed casing):**

```ts
client.getUser(id);
client.fetchPosts(userId);
client.load_comments(postId);
client.removeUser(id);
client.deletePost(postId);
```

**Correct (one verb per concept, one casing scheme):**

```ts
client.getUser(id);
client.getPosts(userId);
client.getComments(postId);
client.deleteUser(id);
client.deletePost(postId);
```
