export class TransitError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "TransitError";
    this.status = status;
  }
}

export class NotFoundError extends TransitError {
  constructor(kind: string, id: string) {
    super(`${kind} ${id} was not found`, 404);
    this.name = "NotFoundError";
  }
}
