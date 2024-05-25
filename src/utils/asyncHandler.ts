import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../types/utility.type";
import logger from "../config/logger.config";

type AsyncFunction = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => Promise<any>;

const asyncHandler = (asyncFunction: AsyncFunction) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    Promise.resolve(asyncFunction(req, res, next)).catch((err) => {
      logger.error(err || "Something Went Wrong");
      next(err);
    });
  };
};

export default asyncHandler;
