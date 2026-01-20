
import { errorMessage } from './Messages.Enum';
import { HttpStatusCode } from './StatusCode.Enum';

export class AppError extends Error {
  statusCode: HttpStatusCode;

  constructor(
    message: errorMessage,
    statusCode: HttpStatusCode = HttpStatusCode.BAD_REQUEST
  ) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
