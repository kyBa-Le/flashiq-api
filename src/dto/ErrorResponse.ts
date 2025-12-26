export class BaseErrorResponse {
  readonly message: string;
  readonly error: string[];

  constructor(message: string, error: string[]) {
    ((this.message = message), (this.error = error));
  }
}
