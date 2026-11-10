# API package

- Every handler in `src/routes/` returns through `send()` from `src/http.ts`, which sets the `X-Quote-Version` header. Do not call `response.end()` directly.
- Carrier rate tables are loaded once at boot. A handler that needs fresh rates calls `reloadRates()`; it never reads the CSV itself.
- Quote ids are ULIDs generated in `src/routes/quotes.ts`. Do not accept an id from the client.
