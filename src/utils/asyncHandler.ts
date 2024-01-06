import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../types/controller-helpers";

type AsyncFunction = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => Promise<any>;

const asyncHandler = (asyncFunction: AsyncFunction) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    Promise.resolve(asyncFunction(req, res, next)).catch((err) => next(err));
  };
};

export default asyncHandler;
