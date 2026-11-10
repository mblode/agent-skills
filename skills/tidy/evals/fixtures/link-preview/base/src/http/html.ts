const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ESCAPES[character]);
}

export function html(strings: TemplateStringsArray, ...values: Array<string | number>): string {
  let out = strings[0];
  for (let index = 0; index < values.length; index += 1) {
    out += escapeHtml(String(values[index])) + strings[index + 1];
  }
  return out;
}
