import { NextFunction, Request, Response } from 'express';
import { BaseException } from '../errors/BaseException';
import { BaseErrorResponse } from '../dto/ErrorResponse';

export const globalExceptionHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.log(err);

  if (err instanceof BaseException) {
    return res.status(err.status).json(new BaseErrorResponse(err.message, []));
  }

  if (err instanceof Error) {
    return res
      .status(500)
      .json(new BaseErrorResponse('Internal server error', [err.message]));
  }
};
