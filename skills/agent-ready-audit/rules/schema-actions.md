---
title: Action schemas for agent interaction
impact: MEDIUM
tags: structured-data, json-ld, actions
---

## Action schemas for agent interaction

Where applicable, include `SearchAction` (on WebSite) and `BuyAction` (on Product > Offer) schemas. These give agents executable entry points — not just content to read, but actions to perform. Products with action schema see 3.2x more AI citations.

**Failing:**

Product page with price and buy button but no action schema — agents know the product exists but not how to purchase.

**Passing:**

```json
{
  "@type": "Product",
  "name": "Widget Pro",
  "offers": {
    "@type": "Offer",
    "price": "49.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "potentialAction": {
      "@type": "BuyAction",
      "target": "https://example.com/cart/add?product=widget-pro"
    }
  }
}
```

BuyAction adoption is near-zero (~100 domains worldwide) — early movers get outsized visibility in agentic commerce.
