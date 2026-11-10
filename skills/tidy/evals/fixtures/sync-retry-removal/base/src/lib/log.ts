type Fields = Record<string, unknown>;

function write(level: "info" | "warn", message: string, fields: Fields): void {
  console.log(JSON.stringify({ level, message, at: new Date().toISOString(), ...fields }));
}

export const log = {
  info: (message: string, fields: Fields = {}) => write("info", message, fields),
  warn: (message: string, fields: Fields = {}) => write("warn", message, fields),
};
