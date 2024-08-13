export class ApplicationException extends Error {
  public status = 400;
  public name = "ApplicationException";

  constructor(message: string, statusCode: number) {
    super(message);
    this.status = statusCode;

    Object.defineProperties(this, {
      message: { value: `[${this.name}] - ${message}`, enumerable: true },
    });
  }
}
