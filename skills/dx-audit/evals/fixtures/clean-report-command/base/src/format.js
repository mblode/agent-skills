const colour =
  Boolean(process.stdout.isTTY) && !process.env.NO_COLOR && process.env.TERM !== "dumb";

export function bold(text) {
  return colour ? `\u001b[1m${text}\u001b[0m` : text;
}

export function money(cents) {
  const sign = cents < 0 ? "-" : "";
  const digits = String(Math.abs(cents)).padStart(3, "0");
  return `${sign}${digits.slice(0, -2)}.${digits.slice(-2)}`;
}

export function table(rows) {
  const labelWidth = Math.max(...rows.map(([label]) => label.length));
  const valueWidth = Math.max(...rows.map(([, value]) => value.length));
  return rows.map(([label, value]) => `${label.padEnd(labelWidth)}  ${value.padStart(valueWidth)}`);
}
