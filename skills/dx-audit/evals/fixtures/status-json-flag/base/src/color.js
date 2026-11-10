const plain = process.stdout.isTTY === false || "NO_COLOR" in process.env;

function wrap(code, text) {
  return plain ? text : `\u001b[${code}m${text}\u001b[0m`;
}

export const green = (text) => wrap(32, text);
export const red = (text) => wrap(31, text);
