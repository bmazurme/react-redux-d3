export default class NotFoundError extends Error {
  status: number;

  constructor(message = 'HTTP 404 Not Found') {
    super(message);

    this.status = 404;
  }
}
