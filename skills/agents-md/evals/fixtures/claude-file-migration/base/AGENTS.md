# Juniper Freight

Freight quoting for regional carriers. A pnpm workspace with an API (`packages/api`) and a web client (`packages/web`).

## Commands

- `pnpm check`: type-check every package.
- `pnpm build`: build every package.
- `pnpm dev`: run the API on `:4800` and the web client on `:4810`.
- One package only: `pnpm --filter @juniper/api check`.

## Rules

- Weights are integer grams and distances integer metres across package boundaries. Convert for display in `packages/web` only.
- A quote is immutable once issued. A changed shipment gets a new quote that references the old one through `supersedes`.
- Do not add a dependency to the root `package.json`; add it to the package that imports it.
