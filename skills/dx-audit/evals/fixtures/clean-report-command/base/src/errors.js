class TallyError extends Error {
  constructor(code, message, details = {}, options = undefined) {
    super(message, options);
    this.name = new.target.name;
    this.code = code;
    this.details = details;
  }
}

export class UsageError extends TallyError {
  exitCode = 2;
}

export class InputError extends TallyError {
  exitCode = 1;
}
