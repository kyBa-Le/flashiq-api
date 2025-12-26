export class BaseSuccessResponse<T> {
  readonly message: string;
  readonly data: T | T[] | null;

  constructor(message: string, data: T | T[] | null) {
    this.message = message;
    this.data = data;
  }
}
