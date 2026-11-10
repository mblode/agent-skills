# Lantern Ledger

Double-entry ledger library used by the billing and payouts services.

## Commands

- `npm test`: run before every commit.
- `npm run build`: emit `dist/` with declarations.

## Rules

- Posted entries are immutable. Correct a mistake by posting a reversing entry, never by editing `Ledger` state.
- `src/rates.json` is the only place a currency is declared. Adding a currency means adding it there first.
- Amounts are integers in the currency's minor unit. Never store or pass a float amount; convert at the edge with `money()`.
- Public API changes need a line in the release notes of the consuming service, because both services pin this package.
- Imports use the `.js` extension, since the package is built as NodeNext ESM.
