import { add, money, type Currency, type Money } from "./money.js";

export interface Entry {
  id: string;
  account: string;
  amount: Money;
  postedAt: string;
}

export class Ledger {
  readonly #entries: Entry[] = [];

  post(entry: Entry): void {
    if (this.#entries.some((existing) => existing.id === entry.id)) {
      throw new Error(`entry ${entry.id} already posted`);
    }
    this.#entries.push(Object.freeze({ ...entry }));
  }

  balance(account: string, currency: Currency): Money {
    return this.#entries
      .filter((entry) => entry.account === account && entry.amount.currency === currency)
      .reduce((total, entry) => add(total, entry.amount), money(currency, 0));
  }

  entries(): readonly Entry[] {
    return this.#entries;
  }
}
