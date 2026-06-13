import type { ErrorResponse, SuccessResponse } from "../types/response.type";

export const createSuccessResponse = <T>(
  statusCode: number,
  message: string = "success",
  data: T,
): SuccessResponse => {
  return {
    success: true,
    statusCode,
    message,
    data,
  };
};

export const createErrorResponse = (
  statusCode: number,
  code: string,
  message: string = "server error",
  errors: Array<Record<string, string>>,
): ErrorResponse => {
  return {
    success: false,
    statusCode,
    message,
    code,
    errors,
  };
};
