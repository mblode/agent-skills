export class UsageError extends Error {
  constructor(message) {
    super(message);
    this.name = "UsageError";
    this.exitCode = 2;
  }
}

export class InputError extends Error {
  constructor(message) {
    super(message);
    this.name = "InputError";
    this.exitCode = 1;
  }
}
