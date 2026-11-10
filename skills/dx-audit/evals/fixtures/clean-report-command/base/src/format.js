const colour = Boolean(process.stdout.isTTY) && !("NO_COLOR" in process.env);

export function bold(text) {
  return colour ? `\u001b[1m${text}\u001b[0m` : text;
}

export function money(value) {
  return value.toFixed(2);
}

export function table(rows) {
  const width = Math.max(...rows.map(([label]) => label.length));
  return rows.map(([label, value]) => `${label.padEnd(width)}  ${value.padStart(10)}`).join("\n");
}
