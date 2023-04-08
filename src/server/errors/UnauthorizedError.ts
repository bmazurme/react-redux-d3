export default class UnauthorizedError extends Error {
  status: number;

  constructor(message = 'HTTP 401 Unauthorized') {
    super(message);

    this.status = 401;
  }
}
