import { NextFunction, Request, Response } from 'express';
import { BaseException } from '../errors/BaseException';
import { BaseErrorResponse } from '../dto/ErrorResponse';
import { JsonWebTokenError } from 'jsonwebtoken';

export const globalExceptionHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.log(err);
  console.log(err);

  if (err instanceof BaseException) {
    return res.status(err.status).json(new BaseErrorResponse(err.message, []));
  }

  if (err instanceof JsonWebTokenError) {
    return res
      .status(400)
      .json(new BaseErrorResponse('Invalid Token', [err.message]));
  }

  if (err instanceof Error) {
    return res
      .status(500)
      .json(new BaseErrorResponse('Internal server error', [err.message]));
  }
};
