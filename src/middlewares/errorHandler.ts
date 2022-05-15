import Boom from '@hapi/boom';
import { Request, Response, NextFunction } from 'express';

export default (
  e: Error,
  req: Request,
  res: Response,
  next?: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
): Response => {
  if (process.env.NODE_ENV !== 'test') {
    console.error('ErrorHandler', { e });
  }

  if (Boom.isBoom(e)) {
    if (Array.isArray(e.data)) {
      return res
        .status(e.output.statusCode)
        .json({ ...e.output.payload, validationErrors: e.data });
    }
    return res.status(e.output.statusCode).json({ ...e.output.payload, data: e.data });
  }



  if (process.env.NODE_ENV !== 'production') {
    return res.status(500).json({
      statusCode: 500,
      error: e.name,
      message: e.message,
      stack: e.stack ? e.stack.split('\n') : null,
    });
  }

  return res.status(500).json({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'An unknown error occurred on the server',
  });
};
