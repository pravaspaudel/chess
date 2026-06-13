export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    isOperational: boolean = true,
  ) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "not found ") {
    super(404, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "you are not authorized ") {
    super(401, message);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "validation error") {
    super(400, message);
  }
}
