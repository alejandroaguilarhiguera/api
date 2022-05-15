/* eslint-disable no-param-reassign */
import { Handler, Request, Response, NextFunction } from 'express';

import errorHandler from './errorHandler';

type handlerWrapperType = (
  cb: Handler,
  withContext?: boolean,
) => (req: Request, res: Response, next: NextFunction) => void;

const handlerWrapper: handlerWrapperType = (handler, withContext = true): Handler => async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { dbConnection } = req.app;
    if (withContext) {
      const context = { dbConnection, user: req.user };
      await handler.call(context, req, res, next);
    } else {
      await handler(req, res, next);
    }
  } catch (e) {
    errorHandler(e, req, res, next);
  }
};

export default handlerWrapper;
