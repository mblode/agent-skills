const interactive = Boolean(process.stdout.isTTY);
const pending = [];
let scheduled = false;

function flush() {
  scheduled = false;
  if (pending.length > 0) {
    process.stdout.write(pending.join(""));
    pending.length = 0;
  }
}

export function print(line) {
  if (interactive) {
    process.stdout.write(`${line}\n`);
    return;
  }
  pending.push(`${line}\n`);
  if (!scheduled) {
    scheduled = true;
    setImmediate(flush);
  }
}
