export default class ForbiddenError extends Error {
  status: number;

  constructor(message = 'HTTP 403 Forbidden') {
    super(message);

    this.status = 403;
  }
}
