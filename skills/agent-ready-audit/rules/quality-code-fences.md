---
title: Code fences properly closed
impact: MEDIUM
tags: content-quality, markdown
---

## Code fences properly closed

All code fences in markdown output must be properly opened and closed. Unclosed fences cause downstream parsing failures — everything after the unclosed fence is treated as code.

**Failing:**

````markdown
## Example

```python
def hello():
    print("hello")

Next section starts here but is inside the code fence...
````

**Passing:**

````markdown
## Example

```python
def hello():
    print("hello")
```

Next section starts here, outside the code fence.
````
