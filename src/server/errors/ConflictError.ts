export default class ConflictError extends Error {
  status: number;

  constructor(message = 'HTTP 409 Conflict') {
    super(message);

    this.status = 409;
  }
}
